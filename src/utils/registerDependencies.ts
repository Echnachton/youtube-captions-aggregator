import { Container } from "inversify"
import { credentialService } from "../services/credentialService";

export const tokens = {
    CredentialService: Symbol.for("CredentialService")
}

export const container = new Container();

export function registerDependencies() {
    container.bind(tokens.CredentialService).to(credentialService)
        .inSingletonScope();
}