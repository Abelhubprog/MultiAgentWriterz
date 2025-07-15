"""Alembic environment configuration for HandyWriterz database migrations."""

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Add the src directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import Base and all models
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

# Import all table definitions by importing the model files
# This ensures all tables are registered with the Base metadata
import src.db.models
import src.prompts.system_prompts

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Use the imported Base metadata
target_metadata = src.db.models.Base.metadata

# Override sqlalchemy.url with environment variable
database_url = os.getenv("DATABASE_URL")
if database_url:
    # Handle postgres:// to postgresql:// conversion
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    config.set_main_option("sqlalchemy.url", database_url)
else:
    # Fallback to development database if no env var
    # Use an absolute path to avoid ambiguity
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "handywriterz.db"))
    config.set_main_option("sqlalchemy.url", f"sqlite:///{db_path}")


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    configuration = config.get_section(config.config_ini_section)
    configuration['sqlalchemy.url'] = config.get_main_option("sqlalchemy.url")
    
    # Use appropriate pool class based on database type
    url = configuration['sqlalchemy.url']
    if 'sqlite' in url:
        poolclass = pool.StaticPool
    else:
        poolclass = pool.NullPool
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=poolclass,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
