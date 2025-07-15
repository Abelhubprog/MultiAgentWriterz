from typing import Dict, Any, List
from agent.base import BaseNode
from agent.handywriterz_state import HandyWriterzState
from services.llm_service import get_llm_client
import asyncio

class EvaluatorNode(BaseNode):
    """
    A node that evaluates the final draft against the user's learning outcomes
    and uses a swarm of marker agents to score the work.
    """

    def __init__(self, name: str):
        super().__init__(name)
        self.marker_models = ["pro", "opus", "sonnet"] # Gemini 1.5 Pro, Claude 3 Opus, Claude 3 Sonnet

    async def execute(self, state: HandyWriterzState) -> Dict[str, Any]:
        """
        Evaluates the draft, maps learning outcomes, and gets scores from marker agents.
        """
        print("⚖️ Executing EvaluatorNode")
        final_draft = state.get("final_draft_content")
        user_params = state.get("user_params", {})
        learning_outcomes = user_params.get("learning_outcomes", [])

        if not final_draft:
            print("⚠️ EvaluatorNode: Missing final_draft, skipping.")
            return {}

        # 1. Map learning outcomes
        lo_mapping_report = await self._map_learning_outcomes(final_draft, learning_outcomes)

        # 2. Get scores from marker agents
        marker_scores = await self._get_marker_scores(final_draft)
        average_score = sum(marker_scores) / len(marker_scores) if marker_scores else 0

        # 3. Determine if the write-up is complete
        is_complete = average_score >= 80

        return {
            "learning_outcomes_report": lo_mapping_report,
            "marker_scores": marker_scores,
            "average_score": average_score,
            "is_complete": is_complete,
        }

    async def _map_learning_outcomes(self, draft: str, learning_outcomes: List[str]) -> str:
        """Maps the draft content to the specified learning outcomes."""
        if not learning_outcomes:
            return "No learning outcomes provided."

        llm = get_llm_client("pro")
        prompt = f"""
        Analyze the following draft and explain how it meets each of the following learning outcomes.
        Provide specific examples from the text to support your analysis.

        Draft:
        ---
        {draft[:8000]}
        ---

        Learning Outcomes:
        - {"\n- ".join(learning_outcomes)}
        """
        report = await llm.generate(prompt, max_tokens=2000)
        return report

    async def _get_marker_scores(self, draft: str) -> List[float]:
        """Gets scores from a swarm of marker agents."""
        
        async def get_score(model_preference: str):
            llm = get_llm_client(model_preference)
            prompt = f"Based on the following academic draft, please provide a percentage score (0-100) representing its quality. Only return the number. \n\n---\n{draft[:8000]}"
            try:
                response = await llm.generate(prompt, max_tokens=10)
                return float(response.strip())
            except (ValueError, TypeError):
                return 75.0 # Default score on failure

        scores = await asyncio.gather(*[get_score(model) for model in self.marker_models])
        return [score for score in scores if score is not None]