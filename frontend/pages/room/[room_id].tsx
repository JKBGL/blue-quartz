import { faArrowRightFromBracket, faPaperPlane, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { randomUUID } from "crypto";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
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
            {
                identify_dialog
                ? <NameDialog onReturnName={sendIdentity} />
                : <Room room={state} />
            }
        </>
    );
}
const ChatLog = () => {
    const [messages, setMessages] = useState([]);
    const [afterJoin, setAfterJoin] = useState(false);
    const pageBottom = useRef(null);

    useEffect(() => {
        socket.on('message', (message) => setMessages(messages => [...messages, message]));
        socket.on('self.joined', (data) => {
            setMessages(data.history);
            setAfterJoin(true);
        });
    }, []);

    // If we are at the bottom of the page
    // do auto scroll for new messages
    useEffect(() => {
        const refRect = pageBottom.current?.getBoundingClientRect();

        // If the client just joined do instant scroll
        // without checking the position
        if (afterJoin == true) {
            pageBottom.current?.scrollIntoView();
            setAfterJoin(false);
        }

        // if the top of the refRect is
        // less than 400px below the bottom of the page
        // do scroll on new messages
        if (refRect.y < window.innerHeight + 400)
            pageBottom.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    return (
        <div className={"message-list"}>
            {
                messages?.map((message) =>
                    <div className="message-item" key={crypto.randomUUID()}>
                        <div className="user">{message.name}</div>
                        <div className="message">{message.message}</div>
                    </div>
                )
            }
            <div ref={pageBottom}></div>
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
            <p className={'user-label grid'}>
                <span>Users</span>
                <span>{users?.length}</span>
            </p>
            <div>
                {
                    users?.map((user) =>
                        <div className={'user-item'} key={user.id} user-id={user.id}>
                            <span>{user.name}</span> <FontAwesomeIcon icon={faUser} />
                        </div>
                    )
                }
            </div>
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
    };

    // Send message by pressing enter
    const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') sendMessage();
    };
        

    return (
        <>
            <div className={"page-container room"}>
                <div className={"info-container"}>
                    <div className={"room-header"}>
                        <h1>Room</h1>
                        <a href="/leave" className={'room-button leave'}><FontAwesomeIcon icon={faArrowRightFromBracket} /> Leave Room</a>
                    </div>
                    <UserLog />
                </div>
                <div className={"chat-container"}>
                    <ChatLog />
                    <div className={"message-input grid"}>
                        <input type={'text'} onChange={handleChange} value={message} placeholder={'Message Room'} onKeyDown={keyDown}></input>
                        <a onClick={() => sendMessage()} className={'room-button send'}><FontAwesomeIcon icon={faPaperPlane} /></a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomContainer;