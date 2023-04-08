import { inject, injectable } from "inversify";
import { tokens } from "../utils";
import type { IYouTubeService } from "../services/youtubeService";
import type { IApplicationParameters } from "../services/applicationParameters";
import { youtube_v3 } from "googleapis";
import { Video } from "../models/Video";
import { GaxiosPromise, GaxiosResponse } from "gaxios";
import type { youtubePlaylistItemsParams } from "../../types/common";

@injectable()
export class YouTubeController {
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
        }

        try {
            this.processPlaylistItemList(initialList.data.items, updateAll);
        } catch (e) {
            console.error(e);
        }

        try {
            let nextPageToken: string | null = initialList.data.nextPageToken;
            while (nextPageToken) {
                const nextList = await this.fetchNextList(nextPageToken);
                this.processPlaylistItemList(nextList.data.items, updateAll);
                nextPageToken = nextList.data.nextPageToken ?? null;
            }
        } catch (e) {
            console.error(e);
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
                const isVideoAlreadyExists = await Video.exists({videoId: item.contentDetails.videoId});
                if (isVideoAlreadyExists) {
                    return
                }
            }

            this.saveVideo(item);
        }
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
}