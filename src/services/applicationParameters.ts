// Contains all the configuration parameters required in this app.

import { injectable } from "inversify";
import { youtubePlaylistItemsParams } from "../../types/common";
import { playlistItemsParams } from "../config";

export interface IApplicationParameters {
    youtubePlaylistItemsParams: youtubePlaylistItemsParams
}

@injectable()
export class ApplicationParameters implements IApplicationParameters {
    private _youtubePlaylistItemsParams: youtubePlaylistItemsParams;

    constructor() {
        this._youtubePlaylistItemsParams = playlistItemsParams;
    }

    public get youtubePlaylistItemsParams(): youtubePlaylistItemsParams {
        return this._youtubePlaylistItemsParams;
    }
}
