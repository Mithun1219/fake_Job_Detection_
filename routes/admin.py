from fastapi import APIRouter
import os

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/logs")
def get_logs():
    if not os.path.exists("prediction_logs.txt"):
        return {"message": "No logs found"}

    with open("prediction_logs.txt", "r") as f:
        logs = f.readlines()

    return {
        "total_logs": len(logs),
        "logs": logs
    }
