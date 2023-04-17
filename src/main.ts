import "reflect-metadata";
import * as dotenv from "dotenv";
import { container, registerDependencies, tokens } from "./utils";
import type { ICredentialService } from "./services/credentialService";
import mongoose from "mongoose";
import type { IYouTubeController } from "./controllers/youtubeController";
import { IYouTubeCaptionService } from "./services/youtubeCaptionService";

dotenv.config();

async function main() {
    // Initialization
    await init();

    // await updateVideoList(false);

    try {
        const res = await getCaptions();
        console.log(res);
    } catch(e) {
        console.error(e);
    }

    console.log("Process exited successfully");
    process.exit(0);
}

// Run at start of app
async function init(): Promise<void> {
    // Register dependencies
    registerDependencies();

    // Connect to db
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
    } catch {
        console.error('Failed to connect to db');
        process.exit(1);
    }

    // Sets youtube api handler
    const credentialService = container.get<ICredentialService>(tokens.CredentialService);
    credentialService.init();
}

async function updateVideoList(updateAll: boolean) {
    const youtubeController = container.get<IYouTubeController>(tokens.YouTubeController);
    return youtubeController.updateVideoList(updateAll);
}

async function getCaptions() {
    const youtubeCaptionService = container.get<IYouTubeCaptionService>(tokens.YouTubeCaptionService);
    return youtubeCaptionService.getCaptions("go", "fr");
}

main();