// Contains all the configuration parameters required in this app.

import { injectable } from "inversify";
import { youtubePlaylistItemsParams } from "../types/common";
import { playlistItemsParams } from "../config";

export interface IApplicationParameters {
    youtubePlaylistItemsParams: youtubePlaylistItemsParams;
    getYoutubeVideoEndpoint: (videoId: string) => string;
}

@injectable()
export class ApplicationParameters implements IApplicationParameters {
    private _youtubePlaylistItemsParams: youtubePlaylistItemsParams;
    private _youtubeVideoEndpoint = "https://www.youtube.com/watch?v=";

    constructor() {
        this._youtubePlaylistItemsParams = playlistItemsParams;
    }

    public get youtubePlaylistItemsParams(): youtubePlaylistItemsParams {
        return this._youtubePlaylistItemsParams;
    }

    // Use this to from urls to go to a specific video on youtube
    public getYoutubeVideoEndpoint(id: string): string {
        return `${this._youtubeVideoEndpoint}${id}`;
    }
}
