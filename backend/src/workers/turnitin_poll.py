"""
Turnitin polling worker for HandyWriterz.
Handles asynchronous polling of Turnitin API for plagiarism check results.
"""

import asyncio
import json
import logging
from typing import Dict, Optional, Any
from datetime import datetime, timedelta

import aioredis
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.database import get_db
from ..db.models import Job, JobStatus
from ..services.security_service import SecurityService

logger = logging.getLogger(__name__)


class TurnitinPoller:
    """Handles polling Turnitin API for plagiarism check results."""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_url = redis_url
        self.redis = None
        self.security_service = SecurityService()
        self.polling_interval = 30  # seconds
        self.max_poll_attempts = 120  # 1 hour max
        
    async def connect(self):
        """Initialize Redis connection."""
        try:
            self.redis = await aioredis.from_url(self.redis_url)
            logger.info("Connected to Redis for Turnitin polling")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise
    
    async def disconnect(self):
        """Close Redis connection."""
        if self.redis:
            await self.redis.close()
            logger.info("Disconnected from Redis")
    
    async def poll_turnitin_result(self, job_id: str, submission_id: str) -> Optional[Dict[str, Any]]:
        """
        Poll Turnitin API for a specific submission result.
        
        Args:
            job_id: The job ID from our system
            submission_id: The Turnitin submission ID
            
        Returns:
            Dictionary containing plagiarism results or None if not ready
        """
        try:
            # This would call the actual Turnitin API
            # For now, we'll simulate the response
            await asyncio.sleep(1)  # Simulate API call
            
            # Mock response structure
            mock_result = {
                "submission_id": submission_id,
                "status": "complete",
                "similarity_score": 15.2,
                "sources_count": 3,
                "report_url": f"https://turnitin.com/reports/{submission_id}",
                "timestamp": datetime.utcnow().isoformat(),
                "details": {
                    "internet_sources": 8.5,
                    "publications": 4.2,
                    "student_papers": 2.5,
                    "matches": [
                        {
                            "source": "academic-source-1.com",
                            "percentage": 8.5,
                            "type": "internet"
                        },
                        {
                            "source": "Journal of Academic Writing",
                            "percentage": 4.2,
                            "type": "publication"
                        }
                    ]
                }
            }
            
            logger.info(f"Retrieved Turnitin result for job {job_id}")
            return mock_result
            
        except Exception as e:
            logger.error(f"Error polling Turnitin for job {job_id}: {e}")
            return None
    
    async def update_job_status(self, job_id: str, result: Dict[str, Any]):
        """Update job status in database with Turnitin results."""
        try:
            async with get_db() as db:
                # Get job from database
                job = await db.get(Job, job_id)
                if not job:
                    logger.error(f"Job {job_id} not found in database")
                    return
                
                # Update job with Turnitin results
                job.turnitin_result = json.dumps(result)
                job.plagiarism_score = result.get("similarity_score", 0)
                job.status = JobStatus.COMPLETED if result.get("status") == "complete" else JobStatus.PROCESSING
                job.updated_at = datetime.utcnow()
                
                await db.commit()
                logger.info(f"Updated job {job_id} with Turnitin results")
                
        except Exception as e:
            logger.error(f"Error updating job {job_id} status: {e}")
    
    async def notify_client(self, job_id: str, result: Dict[str, Any]):
        """Notify client via Redis about Turnitin result completion."""
        try:
            notification = {
                "job_id": job_id,
                "type": "turnitin_complete",
                "result": result,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Publish to Redis channel
            await self.redis.publish(f"job:{job_id}", json.dumps(notification))
            logger.info(f"Notified client about Turnitin completion for job {job_id}")
            
        except Exception as e:
            logger.error(f"Error notifying client for job {job_id}: {e}")
    
    async def process_job(self, job_id: str, submission_id: str):
        """Process a single Turnitin polling job."""
        attempt = 0
        
        while attempt < self.max_poll_attempts:
            try:
                result = await self.poll_turnitin_result(job_id, submission_id)
                
                if result and result.get("status") == "complete":
                    # Update database
                    await self.update_job_status(job_id, result)
                    
                    # Notify client
                    await self.notify_client(job_id, result)
                    
                    logger.info(f"Completed Turnitin polling for job {job_id}")
                    return
                
                elif result and result.get("status") == "error":
                    logger.error(f"Turnitin processing failed for job {job_id}")
                    await self.update_job_status(job_id, result)
                    return
                
                # Wait before next attempt
                await asyncio.sleep(self.polling_interval)
                attempt += 1
                
            except Exception as e:
                logger.error(f"Error processing job {job_id}, attempt {attempt}: {e}")
                attempt += 1
                await asyncio.sleep(self.polling_interval)
        
        # Max attempts reached
        logger.warning(f"Max polling attempts reached for job {job_id}")
        error_result = {
            "status": "timeout",
            "error": "Maximum polling attempts reached",
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.update_job_status(job_id, error_result)
    
    async def start_polling(self):
        """Start the main polling loop."""
        logger.info("Starting Turnitin polling worker")
        
        while True:
            try:
                # Get pending jobs from Redis queue
                job_data = await self.redis.blpop("turnitin_queue", timeout=10)
                
                if job_data:
                    _, job_json = job_data
                    job_info = json.loads(job_json)
                    
                    job_id = job_info.get("job_id")
                    submission_id = job_info.get("submission_id")
                    
                    if job_id and submission_id:
                        logger.info(f"Processing Turnitin job {job_id}")
                        await self.process_job(job_id, submission_id)
                    
            except Exception as e:
                logger.error(f"Error in polling loop: {e}")
                await asyncio.sleep(5)  # Brief pause before continuing


async def main():
    """Main entry point for the Turnitin polling worker."""
    import os
    
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Get Redis URL from environment
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Create and start poller
    poller = TurnitinPoller(redis_url)
    
    try:
        await poller.connect()
        await poller.start_polling()
    except KeyboardInterrupt:
        logger.info("Received interrupt signal, shutting down...")
    finally:
        await poller.disconnect()


if __name__ == "__main__":
    asyncio.run(main())