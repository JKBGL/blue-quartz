import { useRouter } from 'next/router';
import React, { Ref, useEffect, useRef, useState } from 'react';
import closeOnOutside from '../hooks/closeOnOutside';
import isRoomValid from '../hooks/isRoomValid';
import RoomService from '../service/room';
import LoadingSpinner from './loading-spinner';

const RoomIndexPopout = (props: { is_creating: boolean, closeDialog: any }) => {
    // if we are creating or joining a room
    const { is_creating, closeDialog } = props;

    const router = useRouter();
    const [room_key, setRoom] = useState('');
    const [room_valid, setValid] = useState(true);

    // Create null ref and give it to the container
    const containerRef = useRef(null);
    closeOnOutside(containerRef, closeDialog);

    // On init create room if is_creating
    useEffect(() => {
        if (is_creating) {
            const createRoom = async () => {
                setRoom(await RoomService.createRoom());
            }

            createRoom()
                .catch((error) => {
                    // TODO: add error message dialog
                    closeDialog();
                    console.error(error);
                });
        }
    }, []);

    // Join room once the key becomes valid
    // when creating
    useEffect(() => {
        if (is_creating && isRoomValid(room_key, is_creating, setValid))
            joinRoom();
    }, [room_key]);

    // Handle room joining
    const joinRoom = () => {
        if (!isRoomValid(room_key, is_creating, setValid))
            return;

        // Redirect browser to room
        router.push(`/room/${encodeURIComponent(room_key)}`);
    }

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        // prevent browser from doing its own thing
        e.preventDefault();
        if (!is_creating)
            setRoom(e.target.value);
    }

    return (
        <div className="room-popout">
            <div className={"container"} ref={containerRef}>
                {
                    is_creating ? <>
                        <LoadingSpinner />
                        <p className={'centered'}>Creating Room</p>
                    </> : <>
                        <h1>Join Room</h1>
                        <p>Please enter the room key below and click Join.</p>
                        <input type={'text'} className={'keybox'} onChange={handleChange} readOnly={is_creating}></input>
                        <a onClick={() => joinRoom()} className={'room-button join'}>Join</a>
                        {room_valid ? null : <p className={'error'}>Invalid room key.</p>}
                    </>
                }
            </div>
        </div>
    );

};

export default RoomIndexPopout;