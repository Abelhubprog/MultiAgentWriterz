
import asyncio
import httpx
from agent.base import BaseNode
from typing import Any
from fuzzywuzzy import fuzz

class SourceVerifier(BaseNode):
    def __init__(self):
        super().__init__("source_verifier")

    async def execute(self, state: dict, config: Any) -> dict:
        vetted = []
        raw_hits = state.get("raw_hits", [])
        tasks = [self.verify_one(hit, state.get("params", {})) for hit in raw_hits]
        results = await asyncio.gather(*tasks)
        for result in results:
            if result:
                vetted.append(result)
        
        state["sources"] = vetted
        if len(vetted) < state.get("params", {}).get("min_sources", 3):
            state["need_fallback"] = True
        else:
            state["need_fallback"] = False
            
        return state

    async def verify_one(self, hit: dict, params: dict) -> dict | None:
        # Placeholder for Unpaywall/CrossRef enrichment
        meta = await self.enrich(hit)
        
        if not self.is_design_ok(meta, params.get("design")):
            return None
            
        if not self.is_year_ok(meta, params.get("year_from"), params.get("year_to")):
            return None

        is_live, url = await self.is_link_live(meta)
        meta["is_live"] = is_live
        meta["url"] = url

        if not is_live:
            return None
            
        return meta

    async def enrich(self, hit: dict) -> dict:
        # In a real implementation, this would call CrossRef and Unpaywall APIs
        # For now, we'll just simulate it.
        return {
            "id": hit.get("id"),
            "title": hit.get("title"),
            "authors": hit.get("authors"),
            "year": hit.get("year"),
            "journal": hit.get("journal"),
            "doi": hit.get("doi"),
            "design": hit.get("design", "unknown"),
            "url": hit.get("url"),
            "impact": hit.get("impact", 0)
        }

    def is_design_ok(self, meta: dict, required_design: str | None) -> bool:
        if not required_design:
            return True
        # Simple regex/keyword matching for now. Haiku fallback would be implemented here.
        return required_design.lower() in meta.get("design", "").lower()

    def is_year_ok(self, meta: dict, year_from: int | None, year_to: int | None) -> bool:
        pub_year = meta.get("year")
        if not pub_year:
            return False
        if year_from and pub_year < year_from:
            return False
        if year_to and pub_year > year_to:
            return False
        return True

    async def is_link_live(self, meta: dict) -> tuple[bool, str]:
        url = meta.get("url")
        if not url:
            doi = meta.get("doi")
            if not doi:
                return False, ""
            url = f"https://doi.org/{doi}"

        try:
            async with httpx.AsyncClient() as client:
                response = await client.head(url, follow_redirects=True, timeout=5)
            return 200 <= response.status_code < 400, str(response.url)
        except httpx.RequestError:
            return False, url

