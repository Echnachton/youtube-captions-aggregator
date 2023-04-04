import "reflect-metadata";
import * as dotenv from "dotenv";
import { container, registerDependencies, tokens } from "./utils";
import type { ICredentialService } from "./services/credentialService";
import type { IYouTubeService } from "./services/youtubeService";
import type { IApplicationParameters } from "./services/applicationParameters";
dotenv.config();

async function main() {
    // Initialization
    init();

    const applicationParameters = container.get<IApplicationParameters>(tokens.ApplicationParams);
    const youtubeService = container.get<IYouTubeService>(tokens.YouTubeService);
    const res = await youtubeService.getVideos(applicationParameters.youtubePlaylistItemsParams);
    console.log(res);
}

function init() {
    // Register dependencies
    registerDependencies();

    // Sets youtube api handler
    const credentialService = container.get<ICredentialService>(tokens.CredentialService);
    credentialService.init();
}

main();