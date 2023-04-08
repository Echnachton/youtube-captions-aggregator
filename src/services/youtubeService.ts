// This contains wrapper methods for common operations

import { inject, injectable } from "inversify";
import { tokens } from "../utils"
import type { ICredentialService } from "./credentialService";
import type { youtube_v3 } from "googleapis";
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
import type { youtubePlaylistItemsParams } from "../types/common";

export interface IYouTubeService {
    getVideos: (params: youtubePlaylistItemsParams) => GaxiosPromise<youtube_v3.Schema$PlaylistItemListResponse>
}

@injectable()
export class YouTubeService implements IYouTubeService {
    constructor(
        @inject(tokens.CredentialService) private readonly _credentialService: ICredentialService
    ) {}

    /**
     * Gets all the videos of a channel
     */
    public async getVideos(params: youtubePlaylistItemsParams): GaxiosPromise<youtube_v3.Schema$PlaylistItemListResponse> {
        const youtubeHandler = this._credentialService.apiHandler;
        return youtubeHandler.playlistItems.list(params);
    }
}
