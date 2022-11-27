import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faPlus } from '@fortawesome/free-solid-svg-icons';
import CountService from '../service/counts';

const home_page = () => {
    const [counts, setCounts] = useState({ users: 0, rooms: 0 });
    const [isJoining, setIsJoining] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

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
            {isCreating ? null : null}
            {isJoining ? null : null}
            <div className={'page-container'}>
                <div className={'page-header'}>
                    <h1>Blue Quartz</h1>
                    <p>A very small & anonymous chat application</p>
                </div>
                <div className={'page-content'}>
                    <div className={'grid'}>
                        <a className={'room-button'}><FontAwesomeIcon icon={faPlus} />Create Room</a>
                        <a className={'room-button'}><FontAwesomeIcon icon={faRightToBracket} /> Join Room</a>
                    </div>
                    <div>Currently serving <span>{counts.users}</span> users in <span>{counts.rooms}</span> chat rooms!</div>
                </div>
            </div>
        </>
    );
}

export default home_page;

