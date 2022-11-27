import os
from hashlib import sha3_512
from typing import Dict
from fastapi.websockets import WebSocket
from socketio import AsyncServer
import settings

class ChatRoom:
    "Represents a single chat room"
    
    def __init__(self):
        self.key = self.generate_room_key()
        self.host_id: str = None
        self.participants: Dict[str, str] = {}
        "sock_id, name"
        self.message_history: list[(str, str)] = []
        
    def add_participant(self, sock_id: str, participant_name: str) -> bool:
        # if user is already in the room, cancel
        if sock_id in self.participants:
            return False
        
        # First user is aways host
        if len(self.participants) < 1:
            self.set_host(sock_id)
            
        self.participants[sock_id] = participant_name
        return True
    
    def remove_participant(self, participant_id: str) -> None:
        if participant_id in self.participants:
            self.participants.pop(participant_id)
        
    def set_host(self, host_id: str) -> None:
        self.host_id = host_id
        
    def send_message(self, username: str, message: str) -> None:
        self.message_history.append((username, message))
        
    def generate_room_key(self) -> str:
        return str(sha3_512(os.urandom(64)).hexdigest())
    
    def get_room_key(self) -> str:
        return self.key
    
class RoomManager:
    "Manages rooms and connections"
    
    def __init__(self, sock: AsyncServer):
        self.sock: AsyncServer = sock
        self.active_connections: Dict[str, str] = {}
        "sock_id, name"
        self.rooms: Dict[str, ChatRoom] = {}
        self.user_room_mapper: Dict[str, ChatRoom] = {}
        
    def create_room(self) -> str:
        # Room limit reached
        if len(self.rooms) > settings.MAX_ROOMS:
            return None
        
        room = ChatRoom()
        print(room.__dict__)
        self.rooms[room.key] = room
        return room.key
        
    async def connect_user(self, socket_id: str, name: str, room_key: str):
        self.active_connections[socket_id] = name
        self.user_room_mapper[socket_id] = room_key
        room = self.rooms[room_key]
        if socket_id not in room.participants:
            if room.add_participant(socket_id, name):
                # notify participants
                for participant in room.participants.keys():
                    await self.sock.emit('user.join', {"name": name, "id": socket_id}, room=participant)
                
                # tell the client that they connected successfully
                # along with sending participant list and room history
                await self.sock.emit(
                    'self.joined', {
                        "participants": room.participants,
                        "history": room.message_history[:50]
                    }, room=socket_id
                )
            else:
                await self.disconnect_user(socket_id)

    async def disconnect_user(self, socket_id: str):
        room = self.rooms[self.user_room_mapper[socket_id]]
        
        # remove user from cache
        self.active_connections.pop(socket_id)
        self.user_room_mapper.pop(socket_id)
        room.remove_participant(socket_id)
        
        # remove room if all users have left.
        if len(room.participants.keys()) < 1:
            self.rooms.pop(room.key)
            return
        
        # notify participants
        for participant in room.participants.keys():
            await self.sock.emit('user.leave', {"id": socket_id}, room=participant)
        
        # disconnect user socket
        await self.sock.emit('disconnect', 'connection-closed', room=socket_id)
        await self.sock.close_room(socket_id)

    async def send_message(self, socket_id: str, message: str):
        # if user is not in a room, cancel
        if socket_id not in self.active_connections:
            return self.sock.emit('error', {"error": "not-in-room"}, room=socket_id)
        
        room_key = self.user_room_mapper[socket_id]
        room = self.rooms[room_key]
        
        # add message to room history and get participants
        participants = room.send_message(self.active_connections[socket_id], message)
        # notify participants of the new message
        for participant in room.participants.keys():
            await self.sock.emit('message', message, room=participant)
            
    async def get_active_rooms(self, socket_id: str):
        await self.sock.emit('debug.rooms', len(self.rooms), room=socket_id)
    
    async def get_active_users(self, socket_id: str):
        await self.sock.emit('debug.users', len(self.active_connections), room=socket_id)
    