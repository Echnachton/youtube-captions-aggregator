import "reflect-metadata";
import * as dotenv from "dotenv";
import { container, registerDependencies, tokens } from "./utils";
import type { ICredentialService } from "./services/credentialService";
import mongoose from "mongoose";
import type { IYouTubeController } from "./controllers/youtubeController";
import { IYouTubeCaptionService } from "./services/youtubeCaptionService";
import { Video } from "./models/Video";
import { Caption } from "./models/Caption";
import * as readline from "readline";

dotenv.config();

async function main() {
    // Initialization
    await init();

    try {
        await getCaptions();
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
    const videos = await Video.find({});
    const youtubeCaptionService = container.get<IYouTubeCaptionService>(tokens.YouTubeCaptionService);
    
    let count = 0;
    for (const video of videos) {
        const captions = await youtubeCaptionService.getCaptions(video.videoId);
        if (!captions) {
            continue;
        }
        const caption = new Caption({
            videoId: video.videoId,
            caption: captions
        });
        caption.save();

        // TODO: Refactor this and the count method into util
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(count.toString());
        count++;
        await new Promise((resolve) => setTimeout(resolve, 1 * 1000));
    }
}

main();