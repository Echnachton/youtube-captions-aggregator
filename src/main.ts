import "reflect-metadata";
import * as dotenv from "dotenv";
import { container, registerDependencies, tokens } from "./utils";
import type { ICredentialService } from "./services/credentialService";
import mongoose from "mongoose";
import type { IYouTubeController } from "./controllers/youtubeController";
dotenv.config();

async function main() {
    // Initialization
    await init();

    const youtubeController = container.get<IYouTubeController>(tokens.YouTubeController);
    youtubeController.updateVideoList(true);

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

main();