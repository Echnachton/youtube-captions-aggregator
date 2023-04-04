// This is in charge of authenticating you as an API user.

import { google } from "googleapis";
import type { youtube_v3 } from "googleapis";
import { injectable } from "inversify";

export interface ICredentialService {
    apiHandler: youtube_v3.Youtube;
    init: () => void;
}

@injectable()
export class CredentialService implements ICredentialService {
    private _apiHandler: youtube_v3.Youtube;

    public get apiHandler() {
        return this._apiHandler;
    }

    public init() {
        // Gets API handler
        const config: youtube_v3.Options = {
            version: "v3",
            auth: process.env.YOUTUBE_API_KEY
        }
        this._apiHandler = google.youtube(config);
    }
}
