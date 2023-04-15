import { inject, injectable } from "inversify";
import { tokens } from "../utils";
import type { IYouTubeService } from "../services/youtubeService";
import type { IApplicationParameters } from "../services/applicationParameters";
import { youtube_v3 } from "googleapis";
import { Video } from "../models/Video";
import { GaxiosPromise, GaxiosResponse } from "gaxios";
import type { youtubePlaylistItemsParams } from "../types/common";
import * as readline from "readline";

export interface IYouTubeController {
    updateVideoList: (updateAll: boolean) => Promise<void>;
}

@injectable()
export class YouTubeController implements IYouTubeController {
    private _count = 0;
    constructor(
        @inject(tokens.YouTubeService) private readonly _youtubeService: IYouTubeService,
        @inject(tokens.ApplicationParams) private readonly _applicationParams: IApplicationParameters
    ) {}

    /**
     * Gets the latest videos from a channel and updates the database. Almost like a cron job.
     */
    public async updateVideoList(updateAll: boolean): Promise<void> {
        let initialList: GaxiosResponse<youtube_v3.Schema$PlaylistItemListResponse>;

        try {
            initialList = await this.fetchInitialList();
        } catch (e) {
            console.error(e);
            process.exit(1);
        }

        try {
            const message = await this.processPlaylistItemList(initialList.data.items, updateAll);
            if (message === 1) {
                return;
            }
            this.count();
        } catch (e) {
            console.error(e);
            process.exit(1);
        }

        try {
            let nextPageToken: string | null = initialList.data.nextPageToken;
            while (nextPageToken) {
                const nextList = await this.fetchNextList(nextPageToken);
                const message = await this.processPlaylistItemList(nextList.data.items, updateAll);
                if (message === 1) {
                    return;
                }
                nextPageToken = nextList.data.nextPageToken ?? null;
            }
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    private async fetchInitialList(): GaxiosPromise<youtube_v3.Schema$PlaylistItemListResponse> {
        return this._youtubeService.getVideos(this._applicationParams.youtubePlaylistItemsParams);
    }

    private async fetchNextList(nextPageToken: string): GaxiosPromise<youtube_v3.Schema$PlaylistItemListResponse> {
        const params: youtubePlaylistItemsParams = {
            ...this._applicationParams.youtubePlaylistItemsParams,
            pageToken: nextPageToken
        }
        return this._youtubeService.getVideos(params);
    }

    private async processPlaylistItemList(items: youtube_v3.Schema$PlaylistItem[], updateAll: boolean) {
        for (const item of items) {
            if (!updateAll) {
                // If video already exists, exit the process
                const videoId = item.contentDetails.videoId;
                const isVideoAlreadyExists = await Video.exists({videoId});
                if (isVideoAlreadyExists) {
                    console.info(`Video with ID ${videoId} is already stored in the db`);
                    // Tells parent function to exit early
                    return 1;
                }
            }

            this.saveVideo(item);
            this.count();
        }
        return 0;
    }

    private async saveVideo(item: youtube_v3.Schema$PlaylistItem): Promise<void> {
        const { contentDetails, snippet } = item;

        const video = new Video({
            videoId: contentDetails.videoId,
            title: snippet.title,
            description: snippet.description,
            publishDate: new Date(contentDetails.videoPublishedAt),
            duration: contentDetails.endAt
        });

        await video.save();
    }

    private count(): void {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(this._count.toString());
        this._count++;
    } 
}