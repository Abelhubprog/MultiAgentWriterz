# HandyWriterz - The Revolutionary AI Writing Assistant

HandyWriterz is a next-generation AI writing assistant designed for students, researchers, and professionals. It goes beyond simple text generation to provide a comprehensive suite of tools for academic writing, research, and collaboration.

## Advanced Features

*   **Per-User Writing Fingerprint Memory:** HandyWriterz learns your unique writing style, including tone, sentence structure, and citation density. This "fingerprint" is used to generate content that matches your voice.
*   **Evidence-in-Context Hover Cards:** Hover over a citation to see the original evidence in context, including the source paragraph and metadata.
*   **Auto-Slide & Infographic Derivatives:** Automatically generate presentation slides and data visualizations from your final draft.
*   **Continuous Tutor Fine-Tuning Loop:** Our system continuously learns from tutor feedback to improve the quality of its writing.
*   **Consent-Aware Private/Public Vector Segregation:** You have full control over your data. Private documents are stored in a separate, secure vector space.
*   **Arweave Authorship-Proof Hash:** Prove your authorship with an immutable, timestamped record of your document on the Arweave blockchain.
*   **Voice & Multimodal Input:** Use your voice to dictate your ideas, or upload images for analysis with Gemini Vision.
*   **Live Citation-Style Switcher:** Instantly switch between APA, Vancouver, and Harvard citation styles.
*   **Study-Circle Cohort Sharing:** Collaborate with your peers in real-time with shared documents and a live chat.
*   **Tiered Compute Routing:** HandyWriterz automatically selects the best AI model for your task based on its complexity, ensuring a balance of cost and quality.
*   **SCORM Zip Exporter for VLEs:** Export your work as a SCORM-compliant package for easy integration with your Virtual Learning Environment.

## Getting Started

### Prerequisites

*   Docker
*   Python 3.11+
*   Node.js 18+
*   pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/handywriterz.git
    cd handywriterz
    ```

2.  **Set up the backend:**
    ```bash
    cd backend/backend
    pip install -r requirements.txt
    cp .env.example .env
    # TODO( fill-secret ): Fill in the .env file with your API keys
    ```

3.  **Set up the frontend:**
    ```bash
    cd ../../frontend/web/HandyWriterz
    pnpm install
    ```

### Running the Application

1.  **Start the backend services:**
    ```bash
    cd backend/backend
    docker-compose up -d
    ```

2.  **Start the frontend:**
    ```bash
    cd ../../frontend/web/HandyWriterz
    pnpm dev
    ```

The application will be available at `http://localhost:3000`.
