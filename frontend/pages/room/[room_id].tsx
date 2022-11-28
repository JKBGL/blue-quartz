import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NameDialog from "../../components/name-dialog";
import config from "../../config.json";

const RoomManager = (): JSX.Element => {
    const router = useRouter()
    const { room_id } = router.query

    const socket = io(config.API_HOST);

    // TODO:
    //      Move data handling out of this component
    //      because it causes constant re-renders
    //      which is causing a huge socket spam.
    const [identify_dialog, setDialog] = useState(false);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [socket_active, setSocketActive] = useState(false);

    useEffect(() => {
        // Show dialog on identity request
        //socket.on('user.identify', () => setDialog(true));
        //if (!room_id) return;

        socket.on('connect', () => setSocketActive(true));
        socket.on('disconnect', () => setSocketActive(true));

        // Show name prompt on identity request
        socket.on('user.identify', () => setDialog(true));

        socket.on('user.join', (user) => setUsers(users => [...users, user]));
        socket.on('user.leave', (user) => setUsers(users => users.filter((u) => u.id != user.id)));
        socket.on('message', (message) => setMessages(messages => [...messages, message]));
        socket.on('error', (message) => console.error(message));

        // Catchup on our state on join.
        socket.on('self.joined', (data) => {
            setMessages(data.history);
            setUsers(participantsToArray(data.participants));
        });

        // Disconnect on unmount
        return () => {
            // for (
            //     let event of [
            //         'user.identify',
            //         'user.join',
            //         'user.leave',
            //         'message',
            //         'error',
            //         'self.joined',
            //         'connect',
            //         'disconnect',
            //     ]
            // )
            //     socket.off(event);
            socket.close();
        }
    }, []);

    const participantsToArray = (participants: object) => {
        return Object.keys(participants).map((key) => {
            return {id: key, name: participants[key]}
        });
    }

    // Tell the server our identity
    const send_identity = (identity) => socket.emit('user.identity', identity);
    const send_message = (message) => socket.emit('message', {message: message}) && console.log("called message", message);

    let state = {
        id: room_id,
        users: users,
        messages: messages,
        socket_active: socket_active,
        show_dialog: identify_dialog,
        send_identity: send_identity,
        send_message: send_message,
        set_dialog: setDialog,
    }

    return <Room room={state} />;
}

const Room = (props: {
    room: {
        id: string | string[],
        users: any[],
        messages: any[],
        socket_active: boolean,
        show_dialog: boolean,
        send_identity,
        send_message,
        set_dialog,
    }
}): JSX.Element => {
    const { room } = props;
    console.log("Socket Activity: ", room.socket_active);

    const [message, setMessage] = useState('');

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        room.send_message(message);
        setMessage('');
    }

    const sendIdentity = (name) => {
        const identity = {name: name, room_id: room.id};
        room.send_identity(identity);
        room.set_dialog(false);
    }

    return (
        <>
            { room.show_dialog ? <NameDialog onReturnName={sendIdentity} /> : null }
            <div className={"page-container"}>
                <div className={"room-header"}>
                    <h1>Room: insert-room-key-here</h1>
                </div>
                <div className={"user-list"}>
                    {room.users?.map((user) => <div key={user.id}>&lt;{user.id}&gt; {user.name}</div>)}
                </div>
                <div className={"message-list"}>
                    {room.messages?.map((message) => <div>&lt;{message.name}&gt; {message.message}</div>)}
                </div>
                <input type={'text'} onChange={handleChange}></input>
                <a onClick={() => sendMessage()} className={'room-button join'}>Send</a>
            </div>
        </>
    );
};
export default RoomManager;