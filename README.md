# HandyWriterz

## Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/handywriterz.git
    cd handywriterz
    ```

2.  **Set up the environment:**
    Create a `.env` file in the `backend` directory and add the following:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/test"
    REDIS_URL="redis://localhost:6379"
    OPENROUTER_API_KEY="your-openrouter-api-key"
    STRIPE_PUB="your-stripe-public-key"
    COINBASE_PUB="your-coinbase-public-key"
    ```

3.  **Run the development environment:**
    ```bash
    make dev
    ```
    This will start the backend, frontend, and all necessary services.

4.  **Access the application:**
    - Backend: `http://localhost:8000`
    - Frontend: `http://localhost:3000`
