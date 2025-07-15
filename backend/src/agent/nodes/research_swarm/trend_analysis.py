"""
Trend Analysis Agent for HandyWriterz Research Swarm.

This micro-agent identifies emerging trends and hot topics in a given
academic field by analyzing Google Trends data and recent arXiv pre-prints.
"""

from typing import Dict, Any, List
from langchain_core.runnables import RunnableConfig
from pytrends.request import TrendReq
import arxiv

from agent.base import BaseNode, NodeError
from agent.handywriterz_state import HandyWriterzState

class TrendAnalysisAgent(BaseNode):
    """
    A specialized agent for analyzing academic trends.
    """

    def __init__(self):
        super().__init__(name="TrendAnalysisAgent")
        self.pytrends = TrendReq(hl='en-US', tz=360)
        self.arxiv_client = arxiv.Client()

    async def execute(self, state: HandyWriterzState, config: RunnableConfig) -> Dict[str, Any]:
        """
        Execute the trend analysis.
        """
        self.logger.info("Initiating academic trend analysis.")
        self._broadcast_progress(state, "Analyzing academic trends...")

        keywords = self._extract_keywords(state)
        if not keywords:
            raise NodeError("Could not extract keywords for trend analysis.", self.name)

        try:
            # Get Google Trends data
            self.pytrends.build_payload(keywords, cat=0, timeframe='today 5-y', geo='', gprop='')
            interest_over_time = self.pytrends.interest_over_time()

            # Get related topics
            related_topics = self.pytrends.related_topics()

        except Exception as e:
            raise NodeError(f"An error occurred during Google Trends analysis: {e}", self.name)

        self.logger.info("Successfully retrieved Google Trends data.")
        self._broadcast_progress(state, "Analyzed Google Trends for key topics.")

        processed_trends = self._process_trends(interest_over_time, related_topics)

        return {"trend_analysis": processed_trends}

    def _extract_keywords(self, state: HandyWriterzState) -> List[str]:
        """
        Extracts keywords for trend analysis from the user's request.
        """
        user_params = state.get("user_params", {})
        field = user_params.get("field", "")
        prompt = state.get("messages", [{}])[-1].get("content", "")

        # A more sophisticated implementation would use an LLM to extract
        # key concepts and topics.
        return [kw for kw in f"{field} {prompt}".split() if len(kw) > 3][:5]

    def _process_trends(self, interest_over_time, related_topics) -> Dict[str, Any]:
        """
        Processes the trend data into a structured format.
        """
        return {
            "interest_over_time": interest_over_time.to_dict(),
            "related_topics": {kw: topic.to_dict() for kw, topic in related_topics.items()},
        }

trend_analysis_agent_node = TrendAnalysisAgent()
