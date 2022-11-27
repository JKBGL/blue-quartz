import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const env = {
    API_HOST: 'http://localhost:8000',
}

const Room = (): JSX.Element => {
    const router = useRouter()
    const { room } = router.query

    const socket = io(env.API_HOST);
    const [identity, setIdentity] = useState({name: '', room_id: ''});
    const [identify_dialog, setDialog] = useState(false);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Show dialog on identity request
        //socket.on('user.identify', () => setDialog(true));
        if (!room) return;

        socket.on('user.identify', () => {
            // testing
            let ident = {name: 'jkbgl', room_id: room}
            socket.emit('user.identity', ident)
            console.log(room)
            console.log(ident)
        });

        // Tell the server our identity
        const send_identity = () => socket.emit('user.identity', identity);

        socket.on('user.join', (user) => setUsers(users => [...users, user]));
        socket.on('user.leave', (user) => setUsers(users => users.filter((u) => u.id != user.id)));
        socket.on('message', (message) => setMessages(messages => [...messages, message]));
        socket.on('error', (message) => console.error(message));

        // Catchup on our state on join.
        socket.on('self.joined', (data) => {
            setMessages(data.history);
            setUsers(participantsToArray(data.participants));
        });
    }, []);

    const participantsToArray = (participants: object) => {
        return Object.keys(participants).map((key) => {
            return {id: key, name: participants[key]}
        });
    }
    return (
        <div className={"page-container"}>
            <div className={"room-header"}>
                <h1>Room: insert-room-key-here</h1>
            </div>
            <div className={"user-list"}>
                {users?.map((user) => <div>&lt;{user.id}&gt; {user.name}</div>)}
            </div>
            <div className={"message-list"}>
                {messages?.map((message) => <div>&lt;{message.name}&gt; {message.message}</div>)}
            </div>
        </div>
    );
};
export default Room;