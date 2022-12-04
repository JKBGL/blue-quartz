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
    
    if not room_id:
        return {"code": 400, "error": "Room limit reached."}
    
    return {
        "code": 200,
        "message": "success",
        "data": {"room_id": room_id}
    }
    
@api.get("/room/exists/{room_id}", tags=["Rooms"], description="Checks if a room exists.")
async def room_exists(room_id: str):
    value = room_id in room_manager.rooms
    return {
        "code": 200,
        "message": "success",
        "data": {"exists": value}
    }

@api.get("/counts/rooms", tags=["Counts"], description="Returns the number of currently active rooms.")
async def count_rooms():
    return {
        "code": 200,
        "message": "success",
        "data": {"count": len(room_manager.rooms)}
    }
    
@api.get("/counts/users", tags=["Counts"], description="Returns the number of currently active users.")
async def count_rooms():
    return {
        "code": 200,
        "message": "success",
        "data": {"count": len(room_manager.active_connections)}
    }

@api.get("/debug/state", tags=["Debug"], description="Returns the current state of the server.")
async def debug_state():
    return {
        "code": 200,
        "message": "success",
        "data": {
            "rooms": [r for r in room_manager.rooms],
            "active_connections": room_manager.active_connections,
            "user_room_mapper": [ m for m in room_manager.user_room_mapper],
        }
    }