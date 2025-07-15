"""
Gemini State Integration for Unified AI Platform

Imports and adapts the simple Gemini state management for use within
the unified platform's intelligent routing system.
"""

import sys
import os
import logging

# Add the simple system path (backend/src contains the simple Gemini system)
simple_system_path = os.path.join(os.path.dirname(__file__), '../../../..')
# Add the specific path to backend/src
sys.path.insert(0, os.path.join(simple_system_path, 'src'))
sys.path.append(simple_system_path)

logger = logging.getLogger(__name__)

try:
    from agent.state import OverallState as GeminiState
    GEMINI_STATE_AVAILABLE = True
    logger.info("✅ Simple Gemini state imported successfully")
except ImportError as e:
    GeminiState = None
    GEMINI_STATE_AVAILABLE = False
    logger.warning(f"⚠️  Simple Gemini state not available: {e}")

# Export for unified system
__all__ = ['GeminiState', 'GEMINI_STATE_AVAILABLE']