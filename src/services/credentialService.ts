import { google } from "googleapis";
import type { youtube_v3 } from "googleapis";
import { injectable } from "inversify";

export interface ICredentialService {
    apiHandler: youtube_v3.Youtube;
    getApiHandler: () => void;
}

@injectable()
export class credentialService {
    private _apiHandler: youtube_v3.Youtube;

    public get apiHandler() {
        return this._apiHandler;
    }

    public getApiHandler() {
        const config: youtube_v3.Options = {
            version: "v3",
            auth: process.env.YOUTUBE_API_KEY
        }
        this._apiHandler = google.youtube(config);
    }
}
