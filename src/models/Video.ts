// Contains the model for videos

import { Schema, model } from "mongoose"

export interface IVideo {
    videoId: string,
    title: string,
    publishDate: Date,
    description?: string,
    caption?: string,
    duration?: string
}

const videoSchema = new Schema<IVideo>({
    videoId: {type: String, required: true},
    title: {type: String, required: true},
    publishDate: {type: Date, required: true},
    description: String,
    caption: String,
    duration: String,

});

export const Video = model<IVideo>("Video", videoSchema);