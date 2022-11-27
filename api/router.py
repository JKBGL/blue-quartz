from fastapi.routing import APIRouter
from sockfest import room_manager
import settings

api = APIRouter()

@api.get("/version")
async def version():
    return {"version": settings.VERSION }

@api.post("/room/create", tags=["Rooms"], description="Creates a new room and returns its key.")
async def create_room():
    room_id = room_manager.create_room()
    
    return {
        "code": 200,
        "message": "success",
        "data": {"room_id": room_id}
    }