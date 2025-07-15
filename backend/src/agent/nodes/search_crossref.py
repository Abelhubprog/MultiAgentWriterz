
import httpx
from urllib.parse import quote
from typing import Any
from agent.nodes.search_base import BaseSearchNode

class SearchCrossRef(BaseSearchNode):
    def __init__(self):
        super().__init__(api_url="https://api.crossref.org/works")

    def build_query(self, params: dict) -> str:
        query_parts = []
        if "topic" in params:
            query_parts.append(f"query.bibliographic={quote(params['topic'])}")
        if "year_from" in params:
            query_parts.append(f"filter=from-pub-date:{params['year_from']}-01-01")
        return f"{self.api_url}?{'&'.join(query_parts)}&rows=20"

    async def execute(self, state: dict, config: Any) -> dict:
        params = state.get("params", {})
        query = self.build_query(params)
        results = await self._perform_search(query)
        state["raw_hits"] = state.get("raw_hits", []) + results
        return state

    async def _perform_search(self, query: str) -> list[dict]:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(query, timeout=10)
                response.raise_for_status()
            data = response.json()
            return self.normalize(data.get("message", {}).get("items", []))
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {e}")
            return []
        except Exception as e:
            print(f"An error occurred: {e}")
            return []

    def normalize(self, items: list[dict]) -> list[dict]:
        normalized = []
        for item in items:
            authors = [f"{author.get('given', '')} {author.get('family', '')}".strip() for author in item.get("author", [])]
            normalized.append({
                "id": item.get("DOI"),
                "title": item.get("title", [None])[0],
                "authors": ", ".join(authors),
                "year": item.get("published-print", {}).get("date-parts", [[None]])[0][0] or item.get("created", {}).get("date-parts", [[None]])[0][0],
                "journal": item.get("container-title", [None])[0],
                "doi": item.get("DOI"),
                "url": item.get("URL")
            })
        return normalized
