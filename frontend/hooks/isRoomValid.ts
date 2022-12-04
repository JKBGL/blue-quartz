import RoomService from "../service/room";

const isRoomValid = (room_key, is_creating, setValid): boolean => {
    // All room keys should be at least 32+ characters long
    if (room_key.length < 32) {
        setValid(false);
        return false;
    }

    // Execute only if not creating a room
    if (!is_creating) {
        // Make request to check if room is valid
        const checkRoom = async () => {
            const valid = await RoomService.checkRoom(room_key);
            setValid(valid);
            return valid;
        }
        checkRoom().catch(console.error);
    }

    setValid(true);
    return true;
}

export default isRoomValid;