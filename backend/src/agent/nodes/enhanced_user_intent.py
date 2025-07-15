from typing import Dict, Any, List
from agent.base import BaseNode
from agent.handywriterz_state import HandyWriterzState
from services.llm_service import get_llm_client

class EnhancedUserIntentAgent(BaseNode):
    """
    A sophisticated agent that analyzes the user's prompt to understand
    their true intent and asks clarifying questions if necessary.
    """

    def __init__(self, name: str):
        super().__init__(name)
        self.llm_client = get_llm_client(model_preference="pro") # Use a powerful model for analysis

    async def execute(self, state: HandyWriterzState) -> Dict[str, Any]:
        """
        Analyzes the user's prompt and either determines the final parameters
        or generates clarifying questions.
        """
        print("🔎 Executing EnhancedUserIntentAgent")
        prompt = state.get("messages", [])[-1].content
        user_params = state.get("user_params", {})

        # A more complex system would have a detailed system prompt for this agent
        analysis_prompt = f"""
        Analyze the following user request and parameters to determine the full scope of the academic task.

        User Request: "{prompt}"
        Initial Parameters: {user_params}

        Based on this, determine if you have enough information to proceed.
        If not, provide a list of specific questions to ask the user to clarify their requirements.
        The final output should be a JSON object with two keys:
        "should_proceed": boolean
        "clarifying_questions": list of strings (empty if should_proceed is true)
        """

        try:
            response_text = await self.llm_client.generate(analysis_prompt, max_tokens=500)
            analysis_result = json.loads(response_text)
            
            return {
                "should_proceed": analysis_result.get("should_proceed", False),
                "clarifying_questions": analysis_result.get("clarifying_questions", [])
            }

        except Exception as e:
            print(f"❌ EnhancedUserIntentAgent Error: {e}")
            # Fallback to a safe default
            return {
                "should_proceed": False,
                "clarifying_questions": ["Could you please clarify the specific requirements for your task?"]
            }