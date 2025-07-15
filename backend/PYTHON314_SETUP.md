# HandyWriterz Backend - Python 3.14 Setup Guide

This guide provides complete setup instructions for Python 3.14, including workarounds for package compatibility issues.

## 🚀 Quick Start (Recommended)

### Option 1: Automated Setup
```bash
# Navigate to the backend directory
cd backend/backend

# Run the complete setup (includes package installation)
python setup_py314.py

# Test the installation
python test_setup.py

# Start the server
python start_server.py
```

### Option 2: Manual Setup (if automated fails)
```bash
# Step 1: Install essential packages only
python setup_py314.py --install-only

# Step 2: Create database and configuration
python setup_py314.py --no-packages

# Step 3: Test setup
python test_setup.py

# Step 4: Start server
python start_server.py
```

## 📦 Package Installation Strategies

### Strategy 1: Minimal Installation (Most Compatible)
```bash
# Install only essential packages
pip install fastapi>=0.110.0 uvicorn[standard]>=0.27.0 pydantic>=2.6.0 python-dotenv>=1.0.1 aiofiles>=23.2.1 python-multipart>=0.0.9 aiosqlite>=0.19.0
```

### Strategy 2: Core Dependencies
```bash
# Use the Python 3.14 compatible requirements
pip install -r requirements-py314-compatible.txt
```

### Strategy 3: Fallback (if pip issues persist)
```bash
# Install one by one, ignoring failures
pip install fastapi --no-cache-dir
pip install uvicorn --no-cache-dir
pip install pydantic --no-cache-dir
pip install python-dotenv --no-cache-dir
pip install aiofiles --no-cache-dir
pip install aiosqlite --no-cache-dir
```

## 🗄️ Database Setup

The setup script creates a complete SQLite database with all tables:

### Core Tables Created:
- `model_map` - AI model configuration
- `users` - User accounts and credits
- `conversations` - Chat/workflow sessions
- `documents` - Generated documents
- `checkers` - Human verifiers for Turnitin
- `doc_lots` - Document batches
- `doc_chunks` - 350-word document pieces
- `submissions` - Checker submissions
- `checker_payouts` - Payment records
- `wallet_escrows` - USDC escrow transactions
- `system_metrics` - Performance tracking
- `source_cache` - Research source caching
- `private_chunks` - User private content

### Manual Database Creation (if needed):
```bash
# Create database manually
python -c "
import sqlite3
import sys
from pathlib import Path
sys.path.append('src')
from setup_py314 import HandyWriterzSetup
setup = HandyWriterzSetup()
setup.create_database()
"
```

## ⚙️ Configuration

### Environment Variables (.env file)
The setup creates a `.env` file with all necessary configuration. Key settings:

```env
# Database (SQLite by default)
DATABASE_URL=sqlite:///handywriterz.db

# AI API Keys (add your actual keys)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# System Configuration
MAX_CLAIMS_PER_CHECKER=3
TIMEOUT_CHECK_MIN=15
```

**Important:** Edit the `.env` file and add your actual API keys!

## 🧪 Testing Your Setup

### Run the Test Suite
```bash
python test_setup.py
```

### Manual Testing
```bash
# Test database connection
python -c "import sqlite3; print('✅ SQLite OK')"

# Test FastAPI import
python -c "import fastapi; print('✅ FastAPI OK')"

# Test server startup (Ctrl+C to stop)
python start_server.py
```

### API Endpoints to Test
Once the server is running:
- http://localhost:8000/health - Health check
- http://localhost:8000/docs - API documentation
- http://localhost:8000/api/models - Model configuration
- http://localhost:8000/api/status - System status

## 🔧 Troubleshooting

### Common Python 3.14 Issues

#### Issue: Package compilation errors
```bash
# Solution: Use pre-compiled wheels or skip problematic packages
pip install --only-binary=all fastapi uvicorn pydantic
```

#### Issue: Missing C compiler for native packages
```bash
# Solution: Skip packages requiring compilation
python setup_py314.py --no-packages
# Then manually install essential packages only
```

#### Issue: Version conflicts
```bash
# Solution: Use --force-reinstall
pip install fastapi --force-reinstall --no-deps
```

### Database Issues

#### Issue: Database not created
```bash
# Solution: Run database creation manually
python -c "
from setup_py314 import HandyWriterzSetup
setup = HandyWriterzSetup()
success = setup.create_database()
print('✅ Database created' if success else '❌ Failed')
"
```

#### Issue: Permission errors
```bash
# Solution: Check file permissions
chmod 755 .
chmod 666 handywriterz.db
```

### Server Issues

#### Issue: Import errors on startup
```bash
# Solution: Check Python path and imports
python -c "
import sys
from pathlib import Path
sys.path.insert(0, str(Path('src')))
try:
    from main import app
    print('✅ Main app imports OK')
except Exception as e:
    print(f'❌ Import error: {e}')
"
```

#### Issue: Port already in use
```bash
# Solution: Use different port
python start_server.py --port 8001
```

## 🏗️ Architecture Overview

### Minimal Mode Features
- ✅ Database operations (SQLite)
- ✅ Model configuration API
- ✅ Health checks and status
- ✅ Basic FastAPI server
- ✅ Environment configuration

### Full Mode Features (requires all packages)
- ✅ All minimal features
- ✅ AI model integrations
- ✅ Turnitin Workbench
- ✅ Payment system (USDC)
- ✅ Background workers
- ✅ File processing
- ✅ Notifications

### File Structure
```
backend/backend/
├── setup_py314.py              # Setup script
├── start_server.py             # Server startup
├── test_setup.py               # Test suite
├── handywriterz.db             # SQLite database
├── .env                        # Configuration
├── requirements-py314-compatible.txt
└── src/
    ├── main.py                 # Main FastAPI app
    ├── db/
    │   ├── models.py           # Database models
    │   └── database.py         # Database connection
    ├── api/                    # API endpoints
    ├── services/               # Business logic
    └── workers/                # Background tasks
```

## 🚀 Production Deployment

### Using SQLite (Development/Small Scale)
```bash
# Current setup works out of the box
python start_server.py
```

### Upgrading to PostgreSQL (Production)
```bash
# Install PostgreSQL adapter
pip install psycopg[binary] asyncpg

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:pass@localhost/handywriterz
```

### Docker Deployment
```bash
# Use existing Dockerfile
docker build -t handywriterz-backend .
docker run -p 8000:8000 handywriterz-backend
```

## 📞 Support

If you encounter issues:

1. **Check the test script output:** `python test_setup.py`
2. **Verify Python version:** `python --version` (should be 3.14+)
3. **Check package installation:** `pip list | grep fastapi`
4. **Review server logs:** Look for error messages when starting
5. **Database verification:** Check if `handywriterz.db` exists and has tables

### Common Solutions
- **Start fresh:** Delete `handywriterz.db` and `.env`, then run `python setup_py314.py`
- **Minimal install:** Use `--no-packages` flag and install essential packages manually
- **Virtual environment:** Create a clean Python 3.14 virtual environment

The setup is designed to be resilient and work even with partial package installation failures!