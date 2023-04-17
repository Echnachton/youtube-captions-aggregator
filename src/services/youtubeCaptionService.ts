// This gets the captions from youtube
// TODO: Refactor this

import { inject, injectable } from "inversify";
import { tokens } from "../utils";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { JSDOM } from "jsdom";
import type { IApplicationParameters } from "./applicationParameters";
import type { IVideoCaptionInfo } from "../types/common";

export interface IYouTubeCaptionService {
    getCaptions: (videoId: string, targetLanguageCode?: string) => Promise<string>
}

@injectable()
export class YouTubeCaptionService implements IYouTubeCaptionService {
    private _dom = new JSDOM();

    constructor(
        @inject(tokens.ApplicationParams) private _applicationParams: IApplicationParameters
    ) {}

    // TargetLanguageCode is a two character language code defined in ISO 639-1
    public async getCaptions(videoId: string, targetLanguageCode?: string): Promise<string> {
        // This fetches the HTML for the given video
        const videoURL = this._applicationParams.getYoutubeVideoEndpoint(videoId);
        const axiosResponseVideoHTML = await this.fetch<string>(videoURL);

        // This extracts information about the captions inside the HTML
        const captionURI = this.extractCaptionsBaseURI(axiosResponseVideoHTML.data);
        
        // If target language code is set, it will try to get the captions in that language.
        // It may not be available
        if (targetLanguageCode) {
            captionURI.searchParams.set("lang", targetLanguageCode);
        }

        // Fetches the captions
        let axiosResponseCaptions = await this.fetch<string>(captionURI.toString());

        // Parse the xml
        const captionStream = this.parseXML(axiosResponseCaptions.data);

        return this.decodeHTMLEntities(captionStream);
    }

    private async fetch<T>(url: string): Promise<AxiosResponse<T>> {
        const errorMsg = `Failed to fetch ${url}`;
        let axiosResponse: AxiosResponse<T>;
        const axiosOptions: AxiosRequestConfig =  {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
            }
        }

        try {
            axiosResponse = await axios.get(url, axiosOptions);
        } catch(e) {
            console.error(errorMsg);
            Promise.reject(new Error(e));
        }

        if (axiosResponse.status >= 400) {
            console.error(errorMsg);
            Promise.reject(new Error(errorMsg));
        }

        return axiosResponse;
    }

    private extractCaptionsBaseURI(data: string): URL {
        let captionUrl: URL;
        try {
            const regex = /("captionTracks":.*isTranslatable":(true|false)}])/;
            const match = data.match(regex)[0];
            const captionObject: IVideoCaptionInfo = JSON.parse(`{${match}}`);

            captionUrl = new URL(captionObject.captionTracks[0].baseUrl);
        } catch(e) {
            console.error(`Failed to construct caption url`);
            Promise.reject(new Error(e));
        }

        return captionUrl;
    }

    private parseXML(data: string): string {
        let captionStream: string;
        try {
            const parser = new this._dom.window.DOMParser();
            const parsedXML = parser.parseFromString(data, "application/xml");
            const captionArray = parsedXML.querySelectorAll("text");
            for (const textElement of captionArray) {
                captionStream = `${captionStream} ${textElement.textContent}`
            }
        } catch(e) {
            console.error(e);
            Promise.reject(e);
        }

        return captionStream;
    }

    private decodeHTMLEntities(text) {
        var textArea = this._dom.window.document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }
}
