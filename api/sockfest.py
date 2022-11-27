from socketio import AsyncServer
from models.room import RoomManager

sock = AsyncServer(async_mode='asgi', cors_allowed_origins="*")
room_manager = RoomManager(sock)

def format_user(socket_id) -> str:
    "Formats a user for logging: `[socket_id] username`"
    return f"[{socket_id}] {room_manager.active_connections[socket_id]}"

@sock.on('connect')
async def on_connect(socket_id, environ):
    await sock.emit('user.identify', 'identity-name', room=socket_id)

@sock.on('user.identity')
async def on_receive_identity(socket_id, data):
    """
    Required data:
    ```py
    {
        name: str,
        room_id: str
    }
    ```
    """
    
    # make sure we are passing the required parameters
    if 'name' not in data or 'room_id' not in data:
        await sock.emit('error', 'invalid-format', room=socket_id)
    
    await room_manager.connect_user(socket_id, data['name'], data['room_id'])
    print(f"User {format_user(socket_id)} has connected.")

@sock.on('message')
async def on_message(socket_id, message):
    """
    Required data:
    ```py
    {
        message: str
    }
    ```
    """
    # make sure we are passing the required parameters
    if 'message' not in message:
        await sock.emit('error', 'invalid-format', room=socket_id)
        
    print(f"User {format_user(socket_id)} sent a message: {message['message']}")
    await room_manager.send_message(socket_id, message)
    

@sock.on('disconnect')
async def on_disconnect(socket_id):
    print(f"User {format_user(socket_id)} has disconnected.")
    await room_manager.disconnect_user(socket_id)