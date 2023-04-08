import "reflect-metadata";
import * as dotenv from "dotenv";
import { container, registerDependencies, tokens } from "./utils";
import type { ICredentialService } from "./services/credentialService";
import type { IYouTubeService } from "./services/youtubeService";
import type { IApplicationParameters } from "./services/applicationParameters";
import mongoose from "mongoose";
dotenv.config();

async function main() {
    // Initialization
    try {
        init();
    } catch(e) {
        throw new Error(e);
    }

    const applicationParameters = container.get<IApplicationParameters>(tokens.ApplicationParams);
    const youtubeService = container.get<IYouTubeService>(tokens.YouTubeService);
    const res = await youtubeService.getVideos(applicationParameters.youtubePlaylistItemsParams);
    console.log(res);
}

// Run at start of app
async function init(): Promise<void> {
    // Register dependencies
    registerDependencies();

    // Connect to db
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
    } catch {
        throw new Error('Failed to connect to db');
    }

    // Sets youtube api handler
    const credentialService = container.get<ICredentialService>(tokens.CredentialService);
    credentialService.init();
}

main();