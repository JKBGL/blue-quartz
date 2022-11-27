import HTTP from 'axios';

// TODO: find a working .env library
const env = {
    API_HOST: 'http://localhost:8000',
}

class RoomService {
    /**
     * Create a new room
     */
    static async createRoom(): Promise<string> {
        const {data:response} = await HTTP.post(`${env.API_HOST}/rooms`);
        return response.data.room_id;
    }
}