import { tokens } from "./tokens";
import { Container } from "inversify"
import { CredentialService } from "../services/credentialService";
import { YouTubeService } from "../services/youtubeService";
import { ApplicationParameters } from "../services/applicationParameters";
import { YouTubeController } from "../controllers/youtubeController";
import { YouTubeCaptionService } from "../services/youtubeCaptionService";

export const container = new Container();

export function registerDependencies() {
    container.bind(tokens.CredentialService).to(CredentialService)
        .inSingletonScope();
    container.bind(tokens.YouTubeService).to(YouTubeService);
    container.bind(tokens.ApplicationParams).to(ApplicationParameters)
        .inSingletonScope();
    container.bind(tokens.YouTubeController).to(YouTubeController);
    container.bind(tokens.YouTubeCaptionService).to(YouTubeCaptionService);
}