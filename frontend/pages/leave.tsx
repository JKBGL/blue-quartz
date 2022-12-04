import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHouse, faRectangleXmark, faWindowRestore } from "@fortawesome/free-solid-svg-icons";

const LeaveNotification = () => {
    return (
        <div className={'page-container hero'}>
            <div className={'page-header'}>
                <h1>You successfully left the room!</h1>
                <p>Thanks for using Blue Quartz <FontAwesomeIcon icon={faHeart} /></p>
                <a className={'room-button home'} href={'/'}><FontAwesomeIcon icon={faHouse} /> Home</a>
            </div>
        </div>
    );
};

export default LeaveNotification;