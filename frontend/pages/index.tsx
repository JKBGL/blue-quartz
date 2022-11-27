import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faPlus } from '@fortawesome/free-solid-svg-icons';
import CountService from '../service/counts';
import RoomIndexPopout from '../components/room-popout';

const home_page = () => {
    const [counts, setCounts] = useState({ users: 0, rooms: 0 });

    /**
     * 0 - nothing
     * 1 - create room
     * 2 - join room
     */
    const [status, setStatus] = useState(0);

    useEffect(() => {
        const getCounts = async () => {
            setCounts({
                users: await CountService.getUserCount(),
                rooms: await CountService.getRoomCount()
            });
        };

        getCounts().catch(console.error);
    }, []);

    return (
        <>
            {status != 0 ?
                <RoomIndexPopout
                    is_creating={status == 1}
                    closeDialog={() => setStatus(0)}
                />
                : null}
            <div className={'page-container hero'}>
                <div className={'page-header'}>
                    <h1>Blue Quartz</h1>
                    <p>A very small & anonymous chat application</p>
                </div>
                <div className={'page-content'}>
                    <div className={'grid'}>
                        <a onClick={() => setStatus(1)} className={'room-button'}><FontAwesomeIcon icon={faPlus} />Create Room</a>
                        <a onClick={() => setStatus(2)} className={'room-button'}><FontAwesomeIcon icon={faRightToBracket} /> Join Room</a>
                    </div>
                    <div>Currently serving <span>{counts.users}</span> users in <span>{counts.rooms}</span> chat rooms!</div>
                </div>
            </div>
        </>
    );
}

export default home_page;

