import "reflect-metadata";
import * as dotenv from "dotenv";
import { container, registerDependencies, tokens } from "./utils";
import type { ICredentialService } from "./services/credentialService";
dotenv.config();

function main() {
    // Initialization
    init();
}

function init() {
    // Register dependencies
    registerDependencies();

    // Sets youtube api handler
    const credentialService = container.get<ICredentialService>(tokens.CredentialService);
    credentialService.getApiHandler();
}

main();