
import axios from "axios";
export class ExternlApiService {

    static async getPosts() {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data || "Something went wrong")
        }
    }

}