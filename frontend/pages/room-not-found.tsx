import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const RoomNotFound = () => {
    return (
        <>
            <title>Room not found</title>
            <div className={'page-container hero'}>
                <div className={'page-header'}>
                    <h1>Room not found</h1>
                    <p>The room you were trying to join was not found.</p>
                    <a className={'room-button home'} href={'/'}><FontAwesomeIcon icon={faHouse} /> Home</a>
                </div>
            </div>
        </>
    );
};

export default RoomNotFound;