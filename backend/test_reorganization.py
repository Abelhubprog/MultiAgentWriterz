#!/usr/bin/env python3
"""
Test script to validate the reorganized unified system.
Checks imports, routing logic, and basic functionality.
"""

import sys
import os
import asyncio
import logging

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)


def test_imports():
    """Test all imports work correctly."""
    print("\n🧪 Testing Imports...")
    
    # Test simple system import
    try:
        from agent.simple import SIMPLE_SYSTEM_READY, gemini_graph, GeminiState
        print(f"✅ Simple system import: {'Ready' if SIMPLE_SYSTEM_READY else 'Not ready'}")
    except ImportError as e:
        print(f"⚠️  Simple system import failed: {e}")
    
    # Test routing system import
    try:
        from agent.routing import SystemRouter, UnifiedProcessor
        print("✅ Routing system import: Success")
    except ImportError as e:
        print(f"❌ Routing system import failed: {e}")
        return False
    
    # Test advanced system import
    try:
        from agent.handywriterz_graph import handywriterz_graph
        from agent.handywriterz_state import HandyWriterzState
        from agent.base import UserParams
        print("✅ Advanced system import: Success")
    except ImportError as e:
        print(f"❌ Advanced system import failed: {e}")
        return False
    
    return True


async def test_routing_logic():
    """Test routing logic with sample queries."""
    print("\n🎯 Testing Routing Logic...")
    
    try:
        from agent.routing import SystemRouter
        
        # Initialize router
        router = SystemRouter(simple_available=True, advanced_available=True)
        
        # Test simple query
        simple_query = "What is AI?"
        simple_routing = await router.analyze_request(simple_query)
        print(f"✅ Simple query '{simple_query}' → {simple_routing['system']} (complexity: {simple_routing['complexity']:.1f})")
        
        # Test academic query
        academic_query = "Write a 5-page academic essay on climate change with APA citations"
        academic_routing = await router.analyze_request(academic_query)
        print(f"✅ Academic query → {academic_routing['system']} (complexity: {academic_routing['complexity']:.1f})")
        
        # Test medium complexity
        medium_query = "Explain the impact of artificial intelligence on modern healthcare systems"
        medium_routing = await router.analyze_request(medium_query)
        print(f"✅ Medium query → {medium_routing['system']} (complexity: {medium_routing['complexity']:.1f})")
        
        # Test with user params
        user_params = {"writeupType": "essay", "pages": 10, "field": "technology"}
        param_routing = await router.analyze_request("Analyze technology trends", user_params=user_params)
        print(f"✅ Query with params → {param_routing['system']} (complexity: {param_routing['complexity']:.1f})")
        
        return True
        
    except Exception as e:
        print(f"❌ Routing logic test failed: {e}")
        return False


async def test_unified_processor():
    """Test unified processor initialization."""
    print("\n🔄 Testing Unified Processor...")
    
    try:
        from agent.routing import UnifiedProcessor
        
        # Initialize processor
        processor = UnifiedProcessor(simple_available=True, advanced_available=True)
        
        # Test routing stats
        stats = processor.router.get_routing_stats()
        print(f"✅ Processor initialized with {len(stats['routing_modes'])} routing modes")
        print(f"   Systems available: {stats['systems_available']}")
        print(f"   Capabilities: {list(stats['capabilities'].keys())}")
        
        return True
        
    except Exception as e:
        print(f"❌ Unified processor test failed: {e}")
        return False


def test_configuration():
    """Test configuration files and environment."""
    print("\n⚙️ Testing Configuration...")
    
    # Check .env.example exists
    env_example = os.path.join(os.path.dirname(__file__), '.env.example')
    if os.path.exists(env_example):
        print("✅ .env.example file exists")
        
        # Check key configurations
        with open(env_example, 'r') as f:
            content = f.read()
            required_configs = [
                'GEMINI_API_KEY',
                'ANTHROPIC_API_KEY',
                'SIMPLE_MAX_COMPLEXITY',
                'ADVANCED_MIN_COMPLEXITY',
                'DATABASE_URL',
                'REDIS_URL'
            ]
            
            for config in required_configs:
                if config in content:
                    print(f"✅ Config {config} present")
                else:
                    print(f"⚠️  Config {config} missing")
    else:
        print("❌ .env.example file not found")
        return False
    
    # Check setup.py exists
    setup_py = os.path.join(os.path.dirname(__file__), 'setup.py')
    if os.path.exists(setup_py):
        print("✅ setup.py file exists")
    else:
        print("❌ setup.py file not found")
        return False
    
    return True


def test_file_structure():
    """Test reorganized file structure."""
    print("\n📁 Testing File Structure...")
    
    base_dir = os.path.dirname(__file__)
    required_paths = [
        'src/agent/simple/__init__.py',
        'src/agent/simple/gemini_graph.py',
        'src/agent/simple/gemini_state.py',
        'src/agent/routing/__init__.py',
        'src/agent/routing/system_router.py',
        'src/agent/routing/unified_processor.py',
        'src/agent/routing/complexity_analyzer.py',
        'src/agent/handywriterz_graph.py',
        'src/agent/handywriterz_state.py',
        'src/main.py',
        '.env.example',
        'setup.py',
        'README.md'
    ]
    
    all_exist = True
    for path in required_paths:
        full_path = os.path.join(base_dir, path)
        if os.path.exists(full_path):
            print(f"✅ {path}")
        else:
            print(f"❌ {path} - Missing")
            all_exist = False
    
    return all_exist


async def main():
    """Run all tests."""
    print("🚀 Unified AI Platform - Reorganization Validation")
    print("=" * 60)
    
    tests = [
        ("File Structure", test_file_structure),
        ("Configuration", test_configuration), 
        ("Imports", test_imports),
        ("Routing Logic", test_routing_logic),
        ("Unified Processor", test_unified_processor)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            if asyncio.iscoroutinefunction(test_func):
                result = await test_func()
            else:
                result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n📊 Test Results Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Reorganization successful!")
        print("\nNext steps:")
        print("1. Start Redis: redis-server")
        print("2. Configure .env with API keys")
        print("3. Run the server: python src/main.py")
        print("4. Test endpoints: http://localhost:8000/docs")
    else:
        print(f"\n⚠️  {total - passed} tests failed. Please fix issues before proceeding.")
    
    return passed == total


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)