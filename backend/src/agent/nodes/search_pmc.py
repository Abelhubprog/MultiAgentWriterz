
import httpx
from urllib.parse import quote
from typing import Any
from agent.nodes.search_base import BaseSearchNode

class SearchPMC(BaseSearchNode):
    def __init__(self):
        super().__init__(api_url="https://www.ebi.ac.uk/europepmc/webservices/rest/search")

    def build_query(self, params: dict) -> str:
        query = params.get("topic", "")
        if params.get("year_from"):
            query += f" (FIRST_PDATE:[{params['year_from']} TO {params.get('year_to', '')}])"
        return f"{self.api_url}?query={quote(query)}&format=json&resultType=core"

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
            return self.normalize(data.get("resultList", {}).get("result", []))
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
                "id": item.get("doi"),
                "title": item.get("title"),
                "authors": item.get("authorString"),
                "year": int(item.get("pubYear")) if item.get("pubYear") else None,
                "journal": item.get("journalTitle"),
                "doi": item.get("doi"),
                "url": item.get("fullTextUrlList", {}).get("fullTextUrl", [{}])[0].get("url")
            })
        return normalized
