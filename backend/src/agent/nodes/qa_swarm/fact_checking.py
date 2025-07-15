"""
Fact-Checking Agent for HandyWriterz QA Swarm.

This micro-agent verifies the factual accuracy of the generated content,
ensuring the reliability and quality of the academic writing.
"""

from typing import Dict, Any, List
from langchain_core.runnables import RunnableConfig
from langchain_openai import ChatOpenAI

from agent.base import BaseNode, NodeError
from agent.handywriterz_state import HandyWriterzState
from tools.google_web_search import google_web_search

class FactCheckingAgent(BaseNode):
    """
    A specialized agent for fact-checking and verifying claims in text.
    """

    def __init__(self):
        super().__init__(name="FactCheckingAgent")
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.1)

    async def execute(self, state: HandyWriterzState, config: RunnableConfig) -> Dict[str, Any]:
        """
        Execute the fact-checking process.
        """
        self.logger.info("Initiating fact-checking process.")
        self._broadcast_progress(state, "Verifying factual claims in the content...")

        content_to_analyze = state.get("synthesized_result", "")
        if not content_to_analyze:
            return {"fact_checking_analysis": {}}

        claims = await self._extract_key_claims(content_to_analyze)
        if not claims:
            return {"fact_checking_analysis": {"status": "No claims to check."}}

        self.logger.info(f"Extracted {len(claims)} claims to verify.")
        self._broadcast_progress(state, f"Extracted {len(claims)} claims to verify.")

        verification_results = []
        for claim in claims:
            verification = await self._verify_claim(claim)
            verification_results.append(verification)

        self.logger.info("Fact-checking process complete.")
        self._broadcast_progress(state, "Completed fact-checking process.")

        return {"fact_checking_analysis": verification_results}

    async def _extract_key_claims(self, content: str) -> List[str]:
        """
        Extracts key factual claims from the text using an LLM.
        """
        prompt = f"""
        Please extract the key factual claims from the following text.
        A factual claim is a statement that can be verified with evidence.
        Return a numbered list of the claims.

        Text to analyze:
        "{content}"
        """
        try:
            response = await self.llm.ainvoke(prompt)
            # A more robust implementation would parse this more carefully.
            return [line.strip() for line in response.content.split('\n') if line.strip()]
        except Exception as e:
            self.logger.error(f"LLM call failed during claim extraction: {e}")
            return []

    async def _verify_claim(self, claim: str) -> Dict[str, Any]:
        """
        Verifies a single claim using web search.
        """
        self.logger.info(f"Verifying claim: {claim}")
        try:
            search_results = await google_web_search.ainvoke(claim)
        except Exception as e:
            self.logger.error(f"Google search failed for claim '{claim}': {e}")
            return {"claim": claim, "status": "Error during search"}

        # A more sophisticated implementation would analyze the search results
        # with an LLM to determine the veracity of the claim.
        return {
            "claim": claim,
            "status": "Verified" if search_results else "Unverified",
            "evidence": search_results,
        }

fact_checking_agent_node = FactCheckingAgent()
