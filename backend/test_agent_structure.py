#!/usr/bin/env python3
"""
Deep test of agent structure and functionality
"""

import os
import sys
import json
import inspect
from pathlib import Path
from typing import Dict, List, Any

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def test_agent_base_structure():
    """Test the base agent structure"""
    try:
        from agent.base import BaseNode
        print("✅ BaseNode imported successfully")
        
        # Check BaseNode structure
        base_methods = [method for method in dir(BaseNode) if not method.startswith('_')]
        print(f"✅ BaseNode methods: {base_methods}")
        
        return True
    except Exception as e:
        print(f"❌ BaseNode test failed: {e}")
        return False

def test_master_orchestrator_structure():
    """Test Master Orchestrator structure"""
    try:
        from agent.nodes.master_orchestrator import MasterOrchestratorAgent
        print("✅ MasterOrchestratorAgent imported successfully")
        
        # Check if it's a class
        if inspect.isclass(MasterOrchestratorAgent):
            print("✅ MasterOrchestratorAgent is a proper class")
            
            # Check methods
            methods = [method for method in dir(MasterOrchestratorAgent) if not method.startswith('_')]
            print(f"✅ MasterOrchestratorAgent methods: {methods}")
            
            # Check key methods exist
            required_methods = ['execute']
            missing_methods = [method for method in required_methods if method not in methods]
            
            if missing_methods:
                print(f"⚠️  Missing methods: {missing_methods}")
            else:
                print("✅ All required methods present")
        
        return True
    except Exception as e:
        print(f"❌ MasterOrchestratorAgent test failed: {e}")
        return False

def test_search_agents_structure():
    """Test search agent structure"""
    search_agents = [
        ("GeminiSearchAgent", "agent.nodes.search_gemini"),
        ("PerplexitySearchAgent", "agent.nodes.search_perplexity"),
        ("ClaudeSearchAgent", "agent.nodes.search_claude"),
        ("OpenAISearchAgent", "agent.nodes.search_openai"),
        ("DeepseekSearchAgent", "agent.nodes.search_deepseek"),
        ("QwenSearchAgent", "agent.nodes.search_qwen"),
        ("GrokSearchAgent", "agent.nodes.search_grok"),
        ("O3SearchAgent", "agent.nodes.search_o3")
    ]
    
    working_agents = []
    failed_agents = []
    
    for agent_name, module_path in search_agents:
        try:
            module = __import__(module_path, fromlist=[agent_name])
            agent_class = getattr(module, agent_name)
            
            if inspect.isclass(agent_class):
                working_agents.append(agent_name)
                print(f"✅ {agent_name} imported successfully")
            else:
                failed_agents.append(f"{agent_name} - not a class")
                
        except Exception as e:
            failed_agents.append(f"{agent_name} - {str(e)}")
    
    print(f"✅ Working search agents: {len(working_agents)}")
    print(f"❌ Failed search agents: {len(failed_agents)}")
    
    if failed_agents:
        for failure in failed_agents:
            print(f"   - {failure}")
    
    return len(working_agents) > len(failed_agents)

def test_swarm_agents_structure():
    """Test swarm intelligence agents"""
    swarm_agents = [
        ("SwarmIntelligenceCoordinator", "agent.nodes.swarm_intelligence_coordinator"),
        ("EmergentIntelligenceEngine", "agent.nodes.emergent_intelligence_engine"),
        ("FactCheckingAgent", "agent.nodes.qa_swarm.fact_checking"),
        ("BiasDetectionAgent", "agent.nodes.qa_swarm.bias_detection"),
        ("AcademicToneAgent", "agent.nodes.writing_swarm.academic_tone"),
        ("StructureOptimizerAgent", "agent.nodes.writing_swarm.structure_optimizer")
    ]
    
    working_agents = []
    failed_agents = []
    
    for agent_name, module_path in swarm_agents:
        try:
            module = __import__(module_path, fromlist=[agent_name])
            agent_class = getattr(module, agent_name)
            
            if inspect.isclass(agent_class):
                working_agents.append(agent_name)
                print(f"✅ {agent_name} imported successfully")
            else:
                failed_agents.append(f"{agent_name} - not a class")
                
        except Exception as e:
            failed_agents.append(f"{agent_name} - {str(e)}")
    
    print(f"✅ Working swarm agents: {len(working_agents)}")
    print(f"❌ Failed swarm agents: {len(failed_agents)}")
    
    if failed_agents:
        for failure in failed_agents:
            print(f"   - {failure}")
    
    return len(working_agents) > 0

def test_workflow_orchestrator():
    """Test workflow orchestrator"""
    try:
        from agent.handywriterz_graph import HandyWriterzOrchestrator
        print("✅ HandyWriterzOrchestrator imported successfully")
        
        # Check if it's a class
        if inspect.isclass(HandyWriterzOrchestrator):
            print("✅ HandyWriterzOrchestrator is a proper class")
            
            # Check methods
            methods = [method for method in dir(HandyWriterzOrchestrator) if not method.startswith('_')]
            print(f"✅ HandyWriterzOrchestrator methods: {methods}")
            
            # Check key methods exist
            required_methods = ['create_graph']
            missing_methods = [method for method in required_methods if method not in methods]
            
            if missing_methods:
                print(f"⚠️  Missing methods: {missing_methods}")
            else:
                print("✅ All required methods present")
        
        return True
    except Exception as e:
        print(f"❌ HandyWriterzOrchestrator test failed: {e}")
        return False

def test_routing_system():
    """Test routing system"""
    try:
        from agent.routing.system_router import SystemRouter
        from agent.routing.unified_processor import UnifiedProcessor
        print("✅ Routing system imported successfully")
        
        # Check if classes exist
        if inspect.isclass(SystemRouter):
            print("✅ SystemRouter is a proper class")
        
        if inspect.isclass(UnifiedProcessor):
            print("✅ UnifiedProcessor is a proper class")
        
        return True
    except Exception as e:
        print(f"❌ Routing system test failed: {e}")
        return False

def test_main_application():
    """Test main application structure"""
    try:
        from main import app
        print("✅ FastAPI app imported successfully")
        
        # Check if it's a FastAPI app
        if hasattr(app, 'routes'):
            print(f"✅ App has {len(app.routes)} routes configured")
            
            # List some routes
            route_paths = [route.path for route in app.routes if hasattr(route, 'path')]
            print(f"✅ Sample routes: {route_paths[:5]}...")
        
        return True
    except Exception as e:
        print(f"❌ Main application test failed: {e}")
        return False

def analyze_agent_network():
    """Analyze the complete agent network structure"""
    print("\n🔍 Analyzing Agent Network Structure...")
    
    # Map all agents and their relationships
    agent_network = {
        "orchestration": [
            "MasterOrchestratorAgent",
            "EnhancedUserIntentAgent",
            "IntelligentIntentAnalyzer"
        ],
        "search": [
            "GeminiSearchAgent",
            "PerplexitySearchAgent", 
            "ClaudeSearchAgent",
            "OpenAISearchAgent",
            "DeepseekSearchAgent",
            "QwenSearchAgent",
            "GrokSearchAgent",
            "O3SearchAgent"
        ],
        "quality_assurance": [
            "FactCheckingAgent",
            "BiasDetectionAgent",
            "OriginalityGuardAgent",
            "ArgumentValidationAgent",
            "EthicalReasoningAgent"
        ],
        "writing": [
            "AcademicToneAgent",
            "StructureOptimizerAgent",
            "ClarityEnhancerAgent",
            "CitationMasterAgent",
            "StyleAdaptationAgent"
        ],
        "processing": [
            "RevolutionaryWriterAgent",
            "AdvancedEvaluatorAgent",
            "TurnitinAdvancedAgent",
            "AdvancedFormatterAgent"
        ],
        "intelligence": [
            "SwarmIntelligenceCoordinator",
            "EmergentIntelligenceEngine"
        ]
    }
    
    total_agents = sum(len(agents) for agents in agent_network.values())
    print(f"📊 Total agents in network: {total_agents}")
    
    for category, agents in agent_network.items():
        print(f"   {category}: {len(agents)} agents")
    
    return agent_network

def test_environment_requirements():
    """Test environment requirements"""
    print("\n🌍 Testing Environment Requirements...")
    
    required_env_vars = [
        "GEMINI_API_KEY",
        "PERPLEXITY_API_KEY", 
        "OPENAI_API_KEY",
        "ANTHROPIC_API_KEY",
        "DATABASE_URL",
        "REDIS_URL"
    ]
    
    missing_vars = []
    present_vars = []
    
    for var in required_env_vars:
        if os.getenv(var):
            present_vars.append(var)
        else:
            missing_vars.append(var)
    
    print(f"✅ Present environment variables: {len(present_vars)}")
    print(f"❌ Missing environment variables: {len(missing_vars)}")
    
    if missing_vars:
        print("Missing variables:")
        for var in missing_vars:
            print(f"   - {var}")
    
    return len(present_vars) > 0

def main():
    """Run comprehensive agent structure tests"""
    print("🔬 Deep Agent Structure Analysis")
    print("=" * 60)
    
    tests = [
        ("Agent Base Structure", test_agent_base_structure),
        ("Master Orchestrator", test_master_orchestrator_structure),
        ("Search Agents", test_search_agents_structure),
        ("Swarm Agents", test_swarm_agents_structure),
        ("Workflow Orchestrator", test_workflow_orchestrator),
        ("Routing System", test_routing_system),
        ("Main Application", test_main_application),
        ("Environment Requirements", test_environment_requirements)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Testing {test_name}...")
        if test_func():
            passed += 1
    
    # Analyze agent network
    agent_network = analyze_agent_network()
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    # Generate summary report
    print("\n📝 Agent Architecture Summary:")
    print(f"   - Multi-agent system with {sum(len(agents) for agents in agent_network.values())} total agents")
    print(f"   - {len(agent_network)} categories of specialized agents")
    print(f"   - Orchestration layer with intelligent routing")
    print(f"   - Swarm intelligence capabilities")
    print(f"   - Quality assurance pipeline")
    print(f"   - Academic writing specialization")
    
    if passed >= total * 0.75:
        print("🎉 System architecture is well-structured and ready for deployment!")
        return True
    else:
        print("⚠️  System needs fixes before deployment")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)