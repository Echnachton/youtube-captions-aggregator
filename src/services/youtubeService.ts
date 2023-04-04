import { inject, injectable } from "inversify";
import { tokens } from "../utils"
import type { ICredentialService } from "./credentialService";
import type { youtube_v3 } from "googleapis";

@injectable()
export class YouTubeService {
    constructor(
        @inject(tokens.CredentialService) private readonly _credentialService: ICredentialService
    ) {}

    public getVideos() {
        const youtubeHandler = this._credentialService.apiHandler;
        const params: youtube_v3.Params$Resource$Playlistitems$List = {

        };
        youtubeHandler.playlistItems.list(params);
    }
}
