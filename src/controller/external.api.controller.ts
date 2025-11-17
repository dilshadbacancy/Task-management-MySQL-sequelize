import { Response } from 'express';
import { AuthRequest } from "../middleware/auth.middleware";
import { ExternlApiService } from '../service/external.api.service';
import { ApiResponse } from '../utils/api.response';
import { error } from 'console';

class ExternlApiController {

    async fetchPosts(req: AuthRequest, res: Response) {

        await ExternlApiService.getPosts().then((value) => {
            ApiResponse.success(res, "post fetched successfully", value);
        }).catch((error) => {
            ApiResponse.error(res, error.response);
        })

    }
}

export const externlApiController = new ExternlApiController()