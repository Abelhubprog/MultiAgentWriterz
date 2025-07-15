# 🔧 Pluggable-Model Control Panel for HandyWriterz

## Overview

The Pluggable-Model Control Panel allows administrators to dynamically swap AI models used by different HandyWriterz agents without requiring application redeployment. This solution bypasses the Python environment issues by using a JSON-based configuration system with hot-reloading capabilities.

## 🌟 Features

- **Dynamic Model Configuration**: Change models for any agent in real-time
- **JSON-Based Storage**: No database dependencies - uses a simple JSON configuration file
- **Hot-Reloading**: Configuration changes are automatically detected and applied
- **Fallback Handling**: Automatic fallback to alternative models if primary model fails
- **Performance Monitoring**: Track usage metrics, response times, and costs for each model
- **Bulk Updates**: Update multiple agents simultaneously
- **Swarm Intelligence Support**: Configure multi-agent swarm systems
- **Admin UI**: Both React component and standalone HTML interface
- **Security**: Role-based access control for admin functions

## 📁 Architecture

### Core Components

1. **Model Configuration** (`config/models.json`)
   - Central configuration file for all agent models
   - Supports multiple providers (OpenAI, Anthropic, Google, etc.)
   - Hot-reloadable without restart

2. **Model Service** (`src/services/model_service.py`)
   - Dynamic model loading and caching
   - Fallback handling and error recovery
   - Performance metrics collection

3. **Admin API** (`src/routes/admin_models.py`)
   - RESTful endpoints for configuration management
   - Bulk update operations
   - Health monitoring

4. **Admin UI**
   - React component (`frontend/src/components/admin/ModelConfigPanel.tsx`)
   - Standalone HTML interface (`static/admin/model-config.html`)

### File Structure

```
backend/
├── config/
│   └── models.json                          # Central model configuration
├── src/
│   ├── services/
│   │   └── model_service.py                 # Dynamic model loading service
│   ├── routes/
│   │   └── admin_models.py                  # Admin API endpoints
│   └── agent/
│       └── nodes/
│           ├── search_claude.py             # Updated to use dynamic models
│           ├── search_gemini.py             # Updated to use dynamic models
│           └── ...                          # Other agents (to be updated)
├── static/
│   └── admin/
│       └── model-config.html                # Standalone admin UI
└── frontend/
    └── src/
        └── components/
            └── admin/
                └── ModelConfigPanel.tsx     # React admin component
```

## 🚀 Quick Start

### 1. Configuration Setup

The system uses a JSON configuration file located at `backend/config/models.json`. This file defines:

- **Agents**: Individual AI agents and their model assignments
- **Model Providers**: Available providers and their models
- **Swarm Configurations**: Multi-agent swarm intelligence setups
- **Global Settings**: System-wide configuration options

### 2. API Key Configuration

Ensure you have the required API keys set in your environment:

```bash
# Required API keys
export ANTHROPIC_API_KEY=your_claude_key
export OPENAI_API_KEY=your_openai_key
export GOOGLE_API_KEY=your_gemini_key
export PERPLEXITY_API_KEY=your_perplexity_key
export DEEPSEEK_API_KEY=your_deepseek_key
export QWEN_API_KEY=your_qwen_key
export XAI_API_KEY=your_grok_key
```

### 3. Accessing the Admin Interface

#### Option A: Standalone HTML Interface (Recommended for quick access)
Navigate to: `http://localhost:8000/static/admin/model-config.html`

#### Option B: React Component (For integrated admin dashboards)
Import and use the `ModelConfigPanel` component in your React application.

### 4. Making Model Changes

#### Single Agent Update:
1. Open the admin interface
2. Find the agent you want to modify
3. Click "Edit Model"
4. Select a new model from the dropdown
5. Provide a reason for the change (optional)
6. Click "Update Model"

#### Bulk Updates:
1. Toggle "Bulk Update Mode"
2. Select new models for multiple agents
3. Click "Apply Bulk Updates"

## 📚 API Reference

### Admin Endpoints

All admin endpoints require authentication with an admin role.

#### Get Configuration Summary
```http
GET /api/admin/models/config/summary
```

#### List All Agents
```http
GET /api/admin/models/agents
```

#### Get Agent Details
```http
GET /api/admin/models/agents/{agent_name}
```

#### Update Agent Model
```http
PUT /api/admin/models/agents/{agent_name}/model
Content-Type: application/json

{
  "agent_name": "search_claude",
  "new_model": "claude-3-5-sonnet-20241022",
  "reason": "Upgrading to latest model for better performance"
}
```

#### Bulk Update Models
```http
PUT /api/admin/models/agents/bulk-update
Content-Type: application/json

{
  "updates": [
    {"agent_name": "search_claude", "new_model": "claude-3-5-sonnet-20241022"},
    {"agent_name": "search_openai", "new_model": "gpt-4o"}
  ],
  "reason": "Monthly model updates"
}
```

#### Reload Configuration
```http
POST /api/admin/models/reload
```

#### Get Performance Metrics
```http
GET /api/admin/models/metrics
GET /api/admin/models/metrics?agent_name=search_claude
```

## 🔧 Configuration Reference

### Agent Configuration Example

```json
{
  "search_claude": {
    "name": "Claude Search Agent",
    "description": "Analytical reasoning specialist",
    "model": "claude-3-5-sonnet-20241022",
    "fallback_models": ["claude-3-5-haiku-20241022", "gemini-2.0-flash-thinking-exp"],
    "temperature": 0.1,
    "max_tokens": 8000,
    "timeout_seconds": 120,
    "parameters": {
      "top_p": 0.9
    }
  }
}
```

### Provider Configuration Example

```json
{
  "anthropic": {
    "name": "Anthropic",
    "api_key_env": "ANTHROPIC_API_KEY",
    "base_url": "https://api.anthropic.com",
    "models": {
      "claude-3-5-sonnet-20241022": {
        "display_name": "Claude 3.5 Sonnet",
        "context_length": 200000,
        "pricing": {
          "input_per_1k": 0.003,
          "output_per_1k": 0.015
        }
      }
    }
  }
}
```

### Swarm Configuration Example

```json
{
  "qa_swarm": {
    "name": "QA Swarm",
    "description": "Quality assurance collective intelligence",
    "agents": {
      "fact_checking": {
        "model": "o1-preview",
        "weight": 0.3
      },
      "bias_detection": {
        "model": "claude-3-5-sonnet-20241022",
        "weight": 0.25
      }
    },
    "consensus_threshold": 0.75,
    "diversity_target": 0.8
  }
}
```

## 🎯 Agent Integration

### Using the Model Service in Agents

Updated agents use the `ModelService` to dynamically load models:

```python
from services.model_service import get_model_service

class MyAgent:
    def __init__(self):
        self.model_service = get_model_service()
        self.agent_name = "my_agent"
    
    async def execute(self, state, config):
        # Get dynamic model client
        model_client = await self.model_service.get_model_client(self.agent_name)
        
        # Use the model
        response = await model_client.ainvoke(prompt)
        
        # Record metrics
        await self.model_service.record_usage(
            agent_name=self.agent_name,
            tokens_used=estimated_tokens,
            response_time=response_time
        )
        
        return response
```

## 📊 Monitoring and Metrics

The system automatically tracks:

- **Request Count**: Total number of requests per agent
- **Response Time**: Average response time per agent
- **Token Usage**: Total tokens consumed
- **Cost Tracking**: Estimated costs based on provider pricing
- **Error Rates**: Number of failed requests
- **Last Used**: Timestamp of last usage

Access metrics via:
- Admin UI dashboard
- API endpoint: `/api/admin/models/metrics`
- Individual agent metrics: `/api/admin/models/metrics?agent_name=search_claude`

## 🔄 Hot Reloading

The system automatically detects changes to the `models.json` file and reloads the configuration without requiring a restart:

- **Automatic Detection**: File modification timestamps are monitored
- **Cache Clearing**: Model clients are recreated when configuration changes
- **Zero Downtime**: Configuration updates don't interrupt running operations
- **Manual Reload**: Force reload via API or admin UI

## 🛠️ Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure you have admin privileges
   - Check that your auth token is valid
   - Verify the `require_authorization` decorator is properly configured

2. **Model Loading Failures**
   - Check that the required API keys are set
   - Verify the model name exists in the provider configuration
   - Review logs for specific error messages

3. **Configuration Not Reloading**
   - Check file permissions on `models.json`
   - Verify the file is valid JSON
   - Use the manual reload endpoint

4. **Missing Dependencies**
   - Ensure required packages are installed: `langchain-anthropic`, `langchain-openai`, etc.
   - Check that the model service is properly imported

### Health Check

Monitor system health via:
```http
GET /api/admin/models/health
```

This endpoint tests:
- Configuration file accessibility
- Agent configuration validity
- Model client creation
- API key availability

## 🔐 Security Considerations

- **Admin Access Only**: All admin endpoints require elevated privileges
- **Input Sanitization**: All user inputs are validated and sanitized
- **API Key Protection**: API keys are stored as environment variables
- **Audit Logging**: All configuration changes are logged with user attribution
- **Rate Limiting**: API endpoints are protected against abuse

## 🚀 Future Enhancements

Potential improvements for future versions:

1. **A/B Testing**: Compare performance between different models
2. **Cost Optimization**: Automatic model selection based on cost constraints
3. **Load Balancing**: Distribute requests across multiple model instances
4. **Configuration Versioning**: Track and rollback configuration changes
5. **Real-time Alerts**: Notify administrators of performance issues
6. **Model Performance Prediction**: AI-powered model recommendation system

## 📞 Support

For issues or questions:

1. Check the logs in `handywriterz.log`
2. Review the health check endpoint for system status
3. Verify your configuration against the examples provided
4. Consult the API documentation for endpoint specifications

---

This Pluggable-Model Control Panel successfully solves the environment issues by providing a robust, JSON-based configuration system that allows dynamic model management without requiring database migrations or complex Python environment setups.