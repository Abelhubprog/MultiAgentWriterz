"""
Services for managing models and prompts in the multi-agent pipeline.
"""

import logging
import os
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from functools import lru_cache

import yaml
from pydantic import BaseModel, Field, ValidationError
from jinja2 import Template, Environment, FileSystemLoader

logger = logging.getLogger(__name__)

# --- Typed State Hand-off ---
@dataclass
class JobState:
    prompt: str
    context: list
    meta: dict
    outline: Optional[str] = None
    search: Optional[list] = None
    sources: Optional[list] = None
    draft: Optional[str] = None
    qa: Optional[dict] = None

# --- Pydantic Models for Validation ---
class IntentMeta(BaseModel):
    type: str
    word_target: int
    citation_style: str
    region: str

class PlanJson(BaseModel):
    query: str
    k: int
    stage: str

class EvidenceSource(BaseModel):
    title: str
    url: str
    abstract: str
    source_type: str
    year: int
    doi: Optional[str] = None

class QAResponse(BaseModel):
    score: int
    issues: List[Dict[str, Any]]

# --- Model Service ---
class ModelService:
    """Manages the mapping between pipeline stages and models."""

    def __init__(self, config_path: str = "src/config/model_config.yaml"):
        self.config_path = config_path
        self.model_map = self._load_model_map()

    def _load_model_map(self) -> Dict[str, Any]:
        """Loads the model map from the YAML configuration file."""
        try:
            with open(self.config_path, "r") as f:
                config_data = yaml.safe_load(f)
            
            logger.info(f"✅ Model map loaded successfully from {self.config_path}")
            return config_data.get("stages", {})
        except FileNotFoundError:
            logger.error(f"❌ Model configuration file not found at {self.config_path}")
            return {}
        except Exception as e:
            logger.error(f"❌ Error loading model configuration: {e}")
            return {}

    def get_model(self, stage_id: str) -> Optional[str]:
        """Gets the appropriate model for a given stage."""
        stage_config = self.model_map.get(stage_id)
        if not stage_config:
            logger.warning(f"⚠️ No model configuration found for stage: {stage_id}")
            return None
        return stage_config.get("model")

    def reload_config(self) -> bool:
        """Reloads the model configuration from the file."""
        new_model_map = self._load_model_map()
        if new_model_map != self.model_map:
            self.model_map = new_model_map
            return True
        return False

# --- Prompt Service ---
class PromptService:
    """Manages the loading, versioning, and templating of prompts."""

    def __init__(self, db_connection):
        self.db = db_connection
        # Assuming a 'templates' directory for Jinja partials like 'common_header'
        self.jinja_env = Environment(loader=FileSystemLoader('src/prompts/templates'))

    @lru_cache(maxsize=32)
    def get_prompt_template(self, stage: str) -> Optional[Template]:
        """
        Gets the Jinja template for a given stage from the database.
        Uses LRU cache for performance.
        """
        try:
            # This would be an async call in a real application
            # For simplicity, we'll use a synchronous placeholder
            rec = self.db.fetchrow('SELECT template FROM system_prompts WHERE stage_id=$1 ORDER BY version DESC LIMIT 1', stage)
            if rec:
                return self.jinja_env.from_string(rec['template'])
            return None
        except Exception as e:
            logger.error(f"❌ Error fetching prompt template for stage {stage}: {e}")
            return None

    def render_prompt(self, stage: str, context: Dict[str, Any]) -> str:
        """Renders the prompt for a given stage with the provided context."""
        template = self.get_prompt_template(stage)
        if template:
            return template.render(context)
        return ""

    def clear_prompt_cache(self, stage: str):
        """Clears the cache for a specific prompt."""
        self.get_prompt_template.cache_clear()
        logger.info(f"✅ Cache cleared for prompt: {stage}")

# --- Output Validation ---
class OutputValidator:
    """Validates the output of LLM calls with retry logic."""

    def __init__(self, llm, repair_prompt_template: str):
        self.llm = llm
        self.repair_prompt_template = repair_prompt_template

    def validate_and_repair(self, prompt: str, schema: BaseModel, max_retries: int = 3) -> Optional[BaseModel]:
        """
        Validates the LLM output against a Pydantic schema and attempts to repair it on failure.
        """
        for i in range(max_retries):
            out = self.llm.chat(prompt)
            try:
                return schema.parse_raw(out.content)
            except ValidationError as e:
                logger.warning(f"⚠️ Validation failed (attempt {i+1}/{max_retries}): {e}")
                prompt = self.repair_prompt_template.format(bad=out.content)
        
        logger.error(f"❌ Failed to validate output after {max_retries} attempts.")
        raise RuntimeError(f"LLM output validation failed after {max_retries} retries.")

# --- Singleton Instances ---
_model_service = None
_prompt_service = None
_output_validator = None

def get_model_service():
    """Gets the singleton instance of the ModelService."""
    global _model_service
    if _model_service is None:
        _model_service = ModelService()
    return _model_service

def get_prompt_service(db_connection):
    """Gets the singleton instance of the PromptService."""
    global _prompt_service
    if _prompt_service is None:
        _prompt_service = PromptService(db_connection)
    return _prompt_service

def get_output_validator(llm, repair_prompt_template):
    """Gets the singleton instance of the OutputValidator."""
    global _output_validator
    if _output_validator is None:
        _output_validator = OutputValidator(llm, repair_prompt_template)
    return _output_validator