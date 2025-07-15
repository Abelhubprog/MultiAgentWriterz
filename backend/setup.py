#!/usr/bin/env python3
"""
Unified AI Platform Setup Script
Automated setup for the intelligent multi-agent system
"""

import os
import sys
import subprocess
import json
import asyncio
from pathlib import Path

def print_banner():
    """Print setup banner."""
    print("""
    Unified AI Platform Setup
    ===========================
    
    Intelligent Multi-Agent System Setup
    Combining Simple Gemini + Advanced HandyWriterz
    
    """)

def check_python_version():
    """Check Python version compatibility."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 10):
        print("[-] Error: Python 3.10 or higher is required")
        print(f"    Current version: {version.major}.{version.minor}.{version.micro}")
        sys.exit(1)
    print(f"[+] Python {version.major}.{version.minor}.{version.micro} detected")

def check_command_exists(command):
    """Check if a command exists in PATH."""
    try:
        subprocess.run([command, "--version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def check_dependencies():
    """Check system dependencies."""
    print("\n[*] Checking system dependencies...")
    
    dependencies = {
        "git": "Git version control",
        "redis-server": "Redis server", 
        "psql": "PostgreSQL client (optional for advanced features)"
    }
    
    missing = []
    for cmd, desc in dependencies.items():
        if check_command_exists(cmd):
            print(f"[+] {desc}")
        else:
            print(f"[!] {desc} (optional)")
            if cmd != "psql":  # PostgreSQL is optional
                missing.append(cmd)
    
    if missing:
        print(f"\n[!] Missing dependencies: {', '.join(missing)}")
        print("    Install them using your system package manager")
        print("    Ubuntu/Debian: sudo apt-get install <package>")
        print("    macOS: brew install <package>")
        print("    The system will work with reduced functionality")
    
    return len(missing) == 0

def create_virtual_environment():
    """Create and activate virtual environment."""
    print("\n[*] Setting up Python virtual environment...")
    
    if not os.path.exists("venv"):
        try:
            subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
            print("[+] Virtual environment created")
        except subprocess.CalledProcessError:
            print("[-] Failed to create virtual environment")
            return False
    else:
        print("[+] Virtual environment already exists")
    
    # Detect activation script
    if os.name == 'nt':  # Windows
        activate_script = "venv\\Scripts\\activate.bat"
        pip_cmd = "venv\\Scripts\\pip"
    else:  # Unix/Linux/macOS
        activate_script = "venv/bin/activate"
        pip_cmd = "venv/bin/pip"
    
    print(f"   To activate: source {activate_script}")
    return True, pip_cmd

def install_python_packages(pip_cmd):
    """Install Python packages."""
    print("\n[*] Installing Python packages...")
    
    # Core requirements
    core_packages = [
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0", 
        "pydantic==2.5.0",
        "redis==5.0.1",
        "langchain==0.1.0",
        "langchain-core==0.1.0",
        "langgraph==0.0.25",
        "python-multipart==0.0.6",
        "python-dotenv==1.0.0"
    ]
    
    for package in core_packages:
        try:
            subprocess.run([pip_cmd, "install", package], check=True, capture_output=True)
            print(f"[+] Installed {package.split('==')[0]}")
        except subprocess.CalledProcessError as e:
            print(f"[-] Failed to install {package}: {e}")
            return False
    
    # Try to install advanced system requirements
    advanced_requirements = "backend/backend/requirements.txt"
    if os.path.exists(advanced_requirements):
        try:
            subprocess.run([pip_cmd, "install", "-r", advanced_requirements], 
                         check=True, capture_output=True)
            print("[+] Advanced system requirements installed")
        except subprocess.CalledProcessError:
            print("[!] Advanced system requirements installation failed (optional)")
    
    # Try to install simple system requirements  
    simple_requirements = "src/requirements.txt"
    if os.path.exists(simple_requirements):
        try:
            subprocess.run([pip_cmd, "install", "-r", simple_requirements],
                         check=True, capture_output=True)
            print("[+] Simple system requirements installed")
        except subprocess.CalledProcessError:
            print("[!] Simple system requirements installation failed (optional)")
    
    return True

def setup_environment_file():
    """Set up environment configuration."""
    print("\n[*] Setting up environment configuration...")
    
    env_file = ".env"
    example_file = ".env.unified.example"
    
    if os.path.exists(env_file):
        print("[+] .env file already exists")
        return True
    
    if os.path.exists(example_file):
        # Copy example to .env
        with open(example_file, 'r') as f:
            content = f.read()
        
        with open(env_file, 'w') as f:
            f.write(content)
        
        print("[+] Created .env file from example")
        print("    [!] Please edit .env and add your API keys!")
        return True
    else:
        # Create basic .env file
        basic_env = """# Unified AI Platform Configuration
SYSTEM_MODE=hybrid
SIMPLE_SYSTEM_ENABLED=true
ADVANCED_SYSTEM_ENABLED=true

# Add your API keys here
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Database (optional for advanced features)
DATABASE_URL=sqlite:///./handywriterz.db
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET_KEY=your_secure_jwt_secret_key_here
ENVIRONMENT=development
DEBUG=true
"""
        with open(env_file, 'w') as f:
            f.write(basic_env)
        
        print("[+] Created basic .env file")
        print("    [!] Please edit .env and add your API keys!")
        return True

def check_services():
    """Check if required services are running."""
    print("\n[*] Checking services...")
    
    # Check Redis
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, decode_responses=True)
        r.ping()
        print("[+] Redis is running")
    except:
        print("[!] Redis is not running")
        print("    Start with: redis-server")
        print("    Or install: sudo apt-get install redis-server (Ubuntu)")
        print("    Or install: brew install redis (macOS)")
    
    # Check PostgreSQL (optional)
    try:
        import psycopg2
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres"
        )
        conn.close()
        print("[+] PostgreSQL is available (optional)")
    except:
        print("[!] PostgreSQL not available (optional for advanced features)")

def test_unified_system():
    """Test if the unified system can start."""
    print("\n[*] Testing unified system startup...")
    
    try:
        # Import test
        sys.path.append(os.getcwd())
        
        # Test basic imports
        from unified_main import app, SIMPLE_SYSTEM_AVAILABLE, ADVANCED_SYSTEM_AVAILABLE
        
        print(f"[+] Unified system imports successful")
        print(f"    Simple system: {'Available' if SIMPLE_SYSTEM_AVAILABLE else 'Not available'}")
        print(f"    Advanced system: {'Available' if ADVANCED_SYSTEM_AVAILABLE else 'Not available'}")
        
        if SIMPLE_SYSTEM_AVAILABLE or ADVANCED_SYSTEM_AVAILABLE:
            print("[+] At least one system is available")
            return True
        else:
            print("[!] No systems available - check your configuration")
            return False
            
    except Exception as e:
        print(f"[-] System test failed: {e}")
        return False

def print_next_steps():
    """Print next steps for the user."""
    print("""
    [+] Setup Complete!
    ===================
    
    Next Steps:
    
    1. Configure API Keys:
       Edit .env file and add your API keys:
       - GEMINI_API_KEY (required for simple system)
       - ANTHROPIC_API_KEY (required for advanced system)
       - OPENAI_API_KEY (optional)
       - PERPLEXITY_API_KEY (optional)
    
    2. Start Services:
       - Redis: redis-server
       - PostgreSQL (optional): pg_ctl start
    
    3. Start the Server:
       python unified_main.py
    
    4. Access the API:
       - API Documentation: http://localhost:8000/docs
       - Health Check: http://localhost:8000/health
       - Status: http://localhost:8000/api/status
    
    5. Test the System:
       curl -X POST "http://localhost:8000/api/chat" \\
         -H "Content-Type: application/x-www-form-urlencoded" \\
         -d "message=Hello, test the unified AI system!"
    
    6. Configuration Options:
    - SYSTEM_MODE=simple (only simple system)
    - SYSTEM_MODE=advanced (only advanced system)  
    - SYSTEM_MODE=hybrid (automatic routing)
    
    7. Documentation:
    - CLAUDE.md - Development context
    - BACKEND_REORGANIZATION.md - Architecture guide
    - README2.md - Project overview
    
    8. Need Help?
    - Check logs for errors
    - Visit /docs for API documentation
    - Review .env.unified.example for all options
    """)

def main():
    """Main setup function."""
    print_banner()
    
    # Change to script directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    try:
        # Step 1: Check Python version
        check_python_version()
        
        # Step 2: Check system dependencies
        check_dependencies()
        
        # Step 3: Create virtual environment
        success, pip_cmd = create_virtual_environment()
        if not success:
            return
        
        # Step 4: Install Python packages
        if not install_python_packages(pip_cmd):
            print("[-] Package installation failed")
            return
        
        # Step 5: Setup environment file
        setup_environment_file()
        
        # Step 6: Check services
        check_services()
        
        # Step 7: Test the system
        test_unified_system()
        
        # Step 8: Print next steps
        print_next_steps()
        
    except KeyboardInterrupt:
        print("\n[-] Setup interrupted by user")
    except Exception as e:
        print(f"\n[-] Setup failed: {e}")
        print("Please check the error above and try again")

if __name__ == "__main__":
    main()