
import httpx
import os
from urllib.parse import quote
from typing import Any
from agent.nodes.search_base import BaseSearchNode

class SearchSS(BaseSearchNode):
    def __init__(self):
        api_key = os.getenv("SEMANTIC_SCHOLAR_KEY")
        if not api_key:
            print("SEMANTIC_SCHOLAR_KEY not found. Semantic Scholar search will be skipped.")
        super().__init__(
            api_url="https://api.semanticscholar.org/graph/v1/paper/search",
            api_key=api_key
        )

    def build_query(self, params: dict) -> str:
        query = params.get("topic", "")
        year = f"{params.get('year_from', '')}-{params.get('year_to', '')}"
        return f"{self.api_url}?query={quote(query)}&year={year}&limit=20&fields=title,authors,year,journal,doi,url"

    async def execute(self, state: dict, config: Any) -> dict:
        params = state.get("params", {})
        query = self.build_query(params)
        results = await self._perform_search(query)
        state["raw_hits"] = state.get("raw_hits", []) + results
        return state

    async def _perform_search(self, query: str) -> list[dict]:
        if not self.api_key:
            print("Semantic Scholar API key not found.")
            return []
        try:
            headers = {"x-api-key": self.api_key}
            async with httpx.AsyncClient() as client:
                response = await client.get(query, headers=headers, timeout=10)
                response.raise_for_status()
            data = response.json()
            return self.normalize(data.get("data", []))
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {e}")
            return []
        except Exception as e:
            print(f"An error occurred: {e}")
            return []

    def normalize(self, items: list[dict]) -> list[dict]:
        normalized = []
        for item in items:
            normalized.append({
                "id": item.get("paperId"),
                "title": item.get("title"),
                "authors": ", ".join([author["name"] for author in item.get("authors", [])]),
                "year": item.get("year"),
                "journal": item.get("journal", {}).get("name"),
                "doi": item.get("externalIds", {}).get("DOI"),
                "url": item.get("url")
            })
        return normalized
