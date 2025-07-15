"""
Unified Processor for Unified AI Platform

Handles routing between simple and advanced systems and processes
requests using the optimal system based on complexity analysis.
"""

import asyncio
import time
import uuid
import logging
from typing import Dict, Any, List, Optional

from langchain_core.messages import HumanMessage

from .system_router import SystemRouter
from ..handywriterz_state import HandyWriterzState
from ..handywriterz_graph import handywriterz_graph
from ..base import UserParams

logger = logging.getLogger(__name__)


class UnifiedProcessor:
    """
    Unified processor that handles routing between simple and advanced systems.
    Integrates with the existing HandyWriterz architecture.
    """
    
    def __init__(self, simple_available: bool = True, advanced_available: bool = True):
        self.router = SystemRouter(simple_available, advanced_available)
        logger.info("🔄 UnifiedProcessor initialized")
        
    async def process_message(
        self, 
        message: str, 
        files: List = None,
        user_params: dict = None,
        user_id: str = None
    ) -> Dict[str, Any]:
        """Process message using optimal system routing."""
        
        start_time = time.time()
        files = files or []
        
        try:
            # Analyze and route
            routing = await self.router.analyze_request(message, files, user_params)
            logger.info(f"🎯 Routing decision: {routing}")
            
            if routing["system"] == "simple":
                result = await self._process_simple(message, files)
            elif routing["system"] == "advanced":
                result = await self._process_advanced(message, files, user_params, user_id)
            else:  # hybrid
                result = await self._process_hybrid(message, files, user_params, user_id)
            
            # Add routing metadata
            result.update({
                "system_used": routing["system"],
                "complexity_score": routing["complexity"],
                "routing_reason": routing["reason"],
                "routing_confidence": routing["confidence"],
                "processing_time": time.time() - start_time
            })
            
            return result
            
        except Exception as e:
            logger.error(f"Unified processing error: {e}")
            
            # Fallback to advanced system if available
            if routing.get("system") != "advanced" and self.router.advanced_available:
                logger.info("🔄 Falling back to advanced system")
                try:
                    result = await self._process_advanced(message, files, user_params, user_id)
                    result.update({
                        "system_used": "advanced_fallback",
                        "complexity_score": routing.get("complexity", 5.0),
                        "fallback_reason": str(e),
                        "processing_time": time.time() - start_time
                    })
                    return result
                except Exception as fallback_error:
                    logger.error(f"Fallback processing failed: {fallback_error}")
            
            # If all else fails, return error
            return {
                "success": False,
                "response": f"I encountered an error processing your request: {str(e)}",
                "sources": [],
                "workflow_status": "failed",
                "system_used": "error",
                "complexity_score": 0.0,
                "error_details": {
                    "error_type": type(e).__name__,
                    "error_message": str(e)
                }
            }
    
    async def _process_simple(self, message: str, files: List) -> Dict[str, Any]:
        """Process using simple Gemini system."""
        if not self.router.simple_available:
            raise Exception("Simple system not available")
        
        try:
            # Import here to avoid circular imports
            from ..simple import gemini_graph, GeminiState
            
            if gemini_graph is None or GeminiState is None:
                raise Exception("Simple system components not available")
            
            # Create simple state
            state = GeminiState(
                messages=[HumanMessage(content=message)],
                search_query=[message],
                max_research_loops=2
            )
            
            config = {"configurable": {"thread_id": f"simple_session_{uuid.uuid4()}"}}
            result = await gemini_graph.ainvoke(state, config)
            
            # Extract response
            final_message = result["messages"][-1] if result.get("messages") else None
            response_content = final_message.content if final_message else "No response generated"
            
            return {
                "success": True,
                "response": response_content,
                "sources": result.get("sources_gathered", []),
                "workflow_status": "completed",
                "research_loops": result.get("research_loop_count", 0),
                "system_type": "simple_gemini"
            }
            
        except Exception as e:
            logger.error(f"Simple processing error: {e}")
            raise Exception(f"Simple system processing failed: {e}")
    
    async def _process_advanced(
        self, 
        message: str, 
        files: List, 
        user_params: dict = None,
        user_id: str = None
    ) -> Dict[str, Any]:
        """Process using advanced HandyWriterz system."""
        
        try:
            # Create conversation ID
            conversation_id = str(uuid.uuid4())
            
            # Use provided user_params or create defaults
            if user_params:
                validated_params = UserParams(**user_params)
            else:
                # Smart defaults based on message analysis
                validated_params = self._infer_user_params(message)
            
            # Create advanced state
            state = HandyWriterzState(
                conversation_id=conversation_id,
                user_id=user_id or "",
                wallet_address=None,
                messages=[HumanMessage(content=message)],
                user_params=validated_params.dict(),
                uploaded_docs=files,
                outline=None,
                research_agenda=[],
                search_queries=[],
                raw_search_results=[],
                filtered_sources=[],
                verified_sources=[],
                draft_content=None,
                current_draft=None,
                revision_count=0,
                evaluation_results=[],
                evaluation_score=None,
                turnitin_reports=[],
                turnitin_passed=False,
                formatted_document=None,
                learning_outcomes_report=None,
                download_urls={},
                current_node=None,
                workflow_status="initiated",
                error_message=None,
                retry_count=0,
                max_iterations=5,
                enable_tutor_review=False,
                start_time=time.time(),
                end_time=None,
                processing_metrics={},
                auth_token=None,
                payment_transaction_id=None,
                uploaded_files=[{"content": f.get("content", ""), "filename": f.get("filename", "")} for f in files]
            )
            
            # Execute the workflow
            config = {"configurable": {"thread_id": conversation_id}}
            result = await handywriterz_graph.ainvoke(state, config)
            
            # Extract comprehensive results
            return {
                "success": True,
                "response": self._extract_content(result),
                "conversation_id": conversation_id,
                "sources": getattr(result, 'verified_sources', []),
                "workflow_status": getattr(result, 'workflow_status', 'completed'),
                "quality_score": getattr(result, 'evaluation_score', 0),
                "agent_metrics": getattr(result, 'processing_metrics', {}),
                "citation_count": len(getattr(result, 'verified_sources', [])),
                "system_type": "advanced_handywriterz",
                "user_params": validated_params.dict()
            }
            
        except Exception as e:
            logger.error(f"Advanced processing error: {e}")
            raise Exception(f"Advanced system processing failed: {e}")
    
    async def _process_hybrid(
        self, 
        message: str, 
        files: List,
        user_params: dict = None,
        user_id: str = None
    ) -> Dict[str, Any]:
        """Process using hybrid approach (both systems in parallel)."""
        
        try:
            tasks = []
            
            # Start simple system for quick insights
            if self.router.simple_available:
                tasks.append(self._process_simple(message, files))
            
            # Start advanced system for comprehensive analysis
            if self.router.advanced_available:
                tasks.append(self._process_advanced(message, files, user_params, user_id))
            
            # Wait for both to complete
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            simple_result = None
            advanced_result = None
            
            if len(results) == 2:
                simple_result, advanced_result = results
            elif len(results) == 1:
                # Only one system was available
                if self.router.advanced_available:
                    advanced_result = results[0]
                else:
                    simple_result = results[0]
            
            # Handle exceptions
            if isinstance(advanced_result, Exception):
                if isinstance(simple_result, Exception) or simple_result is None:
                    raise advanced_result
                else:
                    # Use simple result as fallback
                    simple_result["system_type"] = "simple_fallback"
                    return simple_result
            
            # If only simple system ran
            if advanced_result is None:
                if isinstance(simple_result, Exception):
                    raise simple_result
                return simple_result
            
            # Combine results intelligently
            combined_sources = []
            if simple_result and not isinstance(simple_result, Exception):
                combined_sources.extend(simple_result.get("sources", []))
            if advanced_result and not isinstance(advanced_result, Exception):
                combined_sources.extend(advanced_result.get("sources", []))
            
            # Deduplicate sources
            unique_sources = []
            seen_urls = set()
            for source in combined_sources:
                url = source.get("url", "")
                if url and url not in seen_urls:
                    unique_sources.append(source)
                    seen_urls.add(url)
                elif not url:  # No URL, include anyway
                    unique_sources.append(source)
            
            return {
                "success": True,
                "response": advanced_result.get("response", ""),
                "conversation_id": advanced_result.get("conversation_id"),
                "sources": unique_sources,
                "workflow_status": "completed",
                "quality_score": advanced_result.get("quality_score", 0),
                "simple_insights": simple_result.get("response", "") if simple_result and not isinstance(simple_result, Exception) else None,
                "advanced_analysis": advanced_result.get("response", ""),
                "research_depth": len(unique_sources),
                "system_type": "hybrid",
                "hybrid_results": {
                    "simple_available": simple_result is not None and not isinstance(simple_result, Exception),
                    "advanced_available": not isinstance(advanced_result, Exception)
                }
            }
            
        except Exception as e:
            logger.error(f"Hybrid processing error: {e}")
            raise Exception(f"Hybrid processing failed: {e}")
    
    def _extract_content(self, result) -> str:
        """Extract final content from HandyWriterz result."""
        
        # Try different content sources in order of preference
        content_sources = [
            'formatted_document',
            'current_draft', 
            'draft_content'
        ]
        
        for source in content_sources:
            content = getattr(result, source, None)
            if content and isinstance(content, str) and content.strip():
                return content
        
        # Fallback to last AI message
        messages = getattr(result, 'messages', [])
        if messages:
            for msg in reversed(messages):
                if hasattr(msg, 'content') and not isinstance(msg, HumanMessage):
                    return msg.content
        
        return "Advanced content generated successfully"
    
    def _infer_user_params(self, message: str) -> UserParams:
        """Infer user parameters from message content."""
        
        message_lower = message.lower()
        
        # Infer writeup type
        writeup_type = "essay"  # default
        if "research" in message_lower:
            writeup_type = "research"
        elif "thesis" in message_lower:
            writeup_type = "thesis"
        elif "report" in message_lower:
            writeup_type = "report"
        
        # Infer pages from message
        pages = 3  # default
        import re
        page_match = re.search(r'(\d+)\s*(?:page|word)', message_lower)
        if page_match:
            num = int(page_match.group(1))
            if "word" in page_match.group(0):
                pages = max(1, num // 300)  # Estimate pages from words
            else:
                pages = num
        
        # Infer field
        field = "general"
        field_keywords = {
            "psychology": ["psychology", "psychological", "mental health"],
            "business": ["business", "management", "marketing", "economics"],
            "technology": ["technology", "computer", "software", "ai", "machine learning"],
            "healthcare": ["health", "medical", "medicine", "nursing"],
            "education": ["education", "teaching", "pedagogy", "learning"],
            "science": ["science", "research", "experiment", "biology", "chemistry"]
        }
        
        for field_name, keywords in field_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                field = field_name
                break
        
        return UserParams(
            writeupType=writeup_type,
            field=field,
            tone="academic",
            language="en", 
            pages=min(max(pages, 1), 50),  # Clamp between 1-50
            referenceStyle="APA",
            educationLevel="undergraduate"
        )