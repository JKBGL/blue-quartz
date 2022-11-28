import { useState } from "react";

const NameDialog = (props: {onReturnName: any}) => {
    const { onReturnName } = props;
    const [name, setName] = useState('');
    
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        // prevent browser from doing its own thing
        e.preventDefault();
        setName(e.target.value);
    };

    const confirmName = () => onReturnName(name);
    return (
        <div className="room-popout">
            <div className={"container"}>
                <h1>Join Room</h1>
                <p>Please enter your name and click Continue.</p>
                <input type={'text'} className={'keybox'} onChange={handleChange} placeholder={'name'}></input>
                <a onClick={() => confirmName()} className={'room-button join'}>Continue</a>
            </div>
        </div>
    );
};

export default NameDialog;