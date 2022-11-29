import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NameDialog from "../../components/name-dialog";
import config from "../../config.json";

// Define the socket outside a component so it doesn't get redefined on every render
const socket = io(config.API_HOST);

// Utility for converting `[id]: name` to `{id, name}`
const participantsToArray = (participants: object) => {
    return Object.keys(participants).map((key) => {
        return {id: key, name: participants[key]}
    });
}

const RoomContainer = (): JSX.Element => {
    const router = useRouter()
    const { room_id } = router.query

    const [socket_active, setSocketActive] = useState(false);
    const [identify_dialog, setDialog] = useState(false);

    useEffect(() => {
        socket.on('connect', () => setSocketActive(true));
        socket.on('disconnect', () => setSocketActive(true));

        // Show name prompt on identity request
        socket.on('user.identify', () => setDialog(true));
        socket.on('error', (message) => console.error(message));

        // Disconnect on unmount
        return () => { socket.close() };
    }, []);

    // Tell the server our identity
    const send_identity = (identity) => socket.emit('user.identity', identity);

    let state = {
        id: room_id,
    }

    const sendIdentity = (name) => {
        const identity = {name: name, room_id: room_id};
        send_identity(identity);
        setDialog(false);
    }

    return (
        <>
            {identify_dialog ? <NameDialog onReturnName={sendIdentity} /> : null}
            <Room room={state} />
        </>
    );
}
const ChatLog = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('message', (message) => setMessages(messages => [...messages, message]));
        socket.on('self.joined', (data) => setMessages(data.history));
    }, []);

    return (
        <div className={"message-list"}>
            {messages?.map((message) => <div>&lt;{message.name}&gt; {message.message}</div>)}
        </div>
    );
};

const UserLog = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('user.join', (user) => setUsers(users => [...users, user]));
        socket.on('user.leave', (user) => setUsers(users => users.filter((u) => u.id !== user.id)));
        socket.on('self.joined', (data) => setUsers(participantsToArray(data.participants)));
    }, []);

    return (
        <div className={"user-list"}>
            {users?.map((user) => <div key={user.id}>&lt;{user.id}&gt; {user.name}</div>)}
        </div>
    );
};

const Room = (props: {
    room: {
        id: string | string[],
    }
}): JSX.Element => {
    const { room } = props;

    const [message, setMessage] = useState('');
    const send_message = (message) => socket.emit('message', {message: message}) && console.log("called message", message);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        send_message(message);
        setMessage('');
    }

    return (
        <>
            <div className={"page-container"}>
                <div className={"room-header"}>
                    <h1>Room: insert-room-key-here</h1>
                </div>
                <UserLog />
                <ChatLog />
                <input type={'text'} onChange={handleChange} value={message}></input>
                <a onClick={() => sendMessage()} className={'room-button join'}>Send</a>
            </div>
        </>
    );
};

export default RoomContainer;