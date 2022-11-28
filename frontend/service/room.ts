import HTTP from 'axios';
import config from '../config.json';

class RoomService {
    /**
     * Create a new room
     * @returns `string` - room_id
     */
    static async createRoom(): Promise<string> {
        const {data:response} = await HTTP.post(`${config.API_HOST}/room/create`); //fix typo after finishing
        return response.data.room_id;
    }

    /**
     * Check if a room exists
     * @param room_id 
     * @returns `boolean`
     */
    static async checkRoom(room_id: string): Promise<boolean> {
        const {data:response} = await HTTP.get(`${config.API_HOST}/room/exists/${room_id}`);
        return response.data.exists;
    }
}

export default RoomService;
