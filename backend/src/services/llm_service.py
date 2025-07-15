import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_community.chat_models.groq import ChatGroq
from config.model_config import get_model_config

def get_llm_client(task: str, model_preference: str = None):
    """
    Returns a LangChain LLM client based on the task and model preference.
    """
    model_config = get_model_config(task)
    
    if model_preference:
        model_name = model_preference
    elif isinstance(model_config, str):
        model_name = model_config
    elif isinstance(model_config, dict):
        model_name = model_config.get("primary")
    else:
        model_name = "gemini-2.5-pro"  # Default model

    if "gemini" in model_name:
        return ChatGoogleGenerativeAI(model=model_name, api_key=os.getenv("GEMINI_API_KEY"))
    elif "grok" in model_name:
        return ChatGroq(model=model_name, api_key=os.getenv("GROQ_API_KEY"))
    elif "openai" in model_name or "gpt" in model_name:
        return ChatOpenAI(model=model_name, api_key=os.getenv("OPENAI_API_KEY"))
    else:  # Default to Gemini 2.5 Pro
        return ChatGoogleGenerativeAI(model="gemini-2.5-pro", api_key=os.getenv("GEMINI_API_KEY"))