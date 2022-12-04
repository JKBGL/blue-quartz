import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
    return (
        <>
            <title>Page not found</title>
            <div className={'page-container hero'}>
                <div className={'page-header'}>
                    <h1>404</h1>
                    <p>Page not found</p>
                    <a className={'room-button home'} href={'/'}><FontAwesomeIcon icon={faHouse} /> Home</a>
                </div>
            </div>
        </>
    );
};

export default NotFound;