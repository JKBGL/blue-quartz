import HTTP from 'axios';

// TODO: find a working .env library
const env = {
    API_HOST: 'http://localhost:8000',
}

class RoomService {
    /**
     * Create a new room
     * @returns `string` - room_id
     */
    static async createRoom(): Promise<string> {
        const {data:response} = await HTTP.post(`${env.API_HOST}/room/create`); //fix typo after finishing
        return response.data.room_id;
    }

    /**
     * Check if a room exists
     * @param room_id 
     * @returns `boolean`
     */
    static async checkRoom(room_id: string): Promise<boolean> {
        const {data:response} = await HTTP.get(`${env.API_HOST}/room/exists/${room_id}`);
        return response.data.exists;
    }
}

export default RoomService;
