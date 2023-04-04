// This is the api query parameters. If you want to use a different set of parameters for a different channel,
// re-export them as playlistItemsParams from the index file.

import type { youtubePlaylistItemsParams } from "../../types/common";

export const artePlaylistItemsParams: youtubePlaylistItemsParams = {
        part: ["snippet"],
        maxResults: 50,
        playlistId: "UUwI-JbGNsojunnHbFAc0M4Q"
}
