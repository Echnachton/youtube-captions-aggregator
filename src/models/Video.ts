// Contains the model for videos

import { Schema, model } from "mongoose"

export interface IVideo {
    videoId: string,
    title: string,
    description: string,
    publishDate: Date,
    caption?: string,
    duration?: string
}

const videoSchema = new Schema<IVideo>({
    videoId: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    publishDate: {type: Date, required: true},
    caption: String,
    duration: String,

});

export const Video = model<IVideo>("Video", videoSchema);