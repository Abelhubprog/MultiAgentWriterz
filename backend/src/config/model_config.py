"""
Centralized configuration for AI models used in the HandyWriterz agent workflow.
This allows for easy updates and management of models for different tasks.
"""

# Model settings for various agent tasks
MODEL_CONFIG = {
    "intent_parser": "gemini-2.5-pro",
    "planner": "gemini-2.5-pro",
    "search": {
        "primary": "gemini-2.5-pro",
        "secondary": "grok-4",
        "tertiary": "openai-03",
    },
    "writing": {
        "primary": "gemini-2.5-pro",
        "fallback": ["grok-4", "openai-03"],
    },
    "evaluation": {
        "primary": "gemini-2.5-pro",
        "secondary": "grok-4",
        "tertiary": "openai-03",
    },
    "orchestration": {
        "strategic_planner": "gemini-2.5-pro",
        "quality_assessor": "gpt-4o",
        "workflow_optimizer": "grok-4",
        "innovation_catalyst": "openai-03",
    },
}

def get_model_config(task: str):
    """
    Retrieves the model configuration for a specific task.
    
    Args:
        task (str): The task for which to retrieve the model configuration 
                    (e.g., "intent_parser", "search", "writing").
                    
    Returns:
        The model configuration for the specified task.
    """
    return MODEL_CONFIG.get(task)