from typing import Dict, Any, List
import pandas as pd
from agent.base import BaseNode
from agent.handywriterz_state import HandyWriterzState

class AggregatorNode(BaseNode):
    """An agent that aggregates data from various sources."""

    def __init__(self):
        super().__init__("aggregator")

    async def execute(self, state: HandyWriterzState, config: dict) -> Dict[str, Any]:
        """
        Executes the aggregator agent.

        Args:
            state: The current state of the HandyWriterz workflow.
            config: The configuration for the agent.

        Returns:
            A dictionary containing the aggregated data.
        """
        github_repos = state.get("github_repos", [])
        arxiv_papers = state.get("arxiv_papers", [])
        crossref_citations = state.get("crossref_citations", [])
        pubmed_records = state.get("pubmed_records", [])
        github_issues = state.get("github_issues", [])

        # Create DataFrames for each data source
        repos_df = pd.DataFrame(github_repos)
        papers_df = pd.DataFrame(arxiv_papers)
        citations_df = pd.DataFrame(crossref_citations)
        pubmed_df = pd.DataFrame(pubmed_records)
        issues_df = pd.DataFrame(github_issues)

        # Merge the DataFrames
        # This is a simplified example. A more robust implementation would
        # use more sophisticated merging logic.
        merged_df = pd.merge(repos_df, papers_df, left_on="full_name", right_on="repo_name", how="left")
        merged_df = pd.merge(merged_df, citations_df, on="doi", how="left")
        merged_df = pd.merge(merged_df, pubmed_df, on="doi", how="left")
        merged_df = pd.merge(merged_df, issues_df, left_on="full_name", right_on="repo_name", how="left")

        # Sort by citation velocity
        merged_df["citation_velocity"] = merged_df["citation_count"] / (pd.to_datetime("today") - pd.to_datetime(merged_df["publication_date"])).dt.days
        merged_df = merged_df.sort_values(by="citation_velocity", ascending=False)

        return {"aggregated_data": merged_df.to_dict("records")}
