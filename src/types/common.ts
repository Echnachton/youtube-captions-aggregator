import type { youtube_v3 } from "googleapis";

export type youtubePlaylistItemsParams = youtube_v3.Params$Resource$Playlistitems$List;

// Information for that is expected to be acquired the HTML of the video page
export interface IVideoCaptionInfo {
    captionTracks: {
        baseUrl: string;
        name: {
            simpleText: string
        },
        vssId: string,
        languageCode: string,
        kind: string,
        isTranslatable:true
    } []
}