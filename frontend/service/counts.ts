import HTTP from 'axios';
import config from '../config.json';

class CountService {
    /**
     * Get count of all users currently using the app
     * @returns `number`
     */
    static async getUserCount(): Promise<number> {
        const {data:response} = await HTTP.get(`${config.API_HOST}/counts/users`);
        return response.data.count;
    }

    /**
     * Get count of all active rooms
     * @returns `number`
     */
    static async getRoomCount(): Promise<number> {
        const {data:response} = await HTTP.get(`${config.API_HOST}/counts/rooms`);
        return response.data.count;
    }
}

export default CountService;