import { Schema, model } from "mongoose";

export interface ICaption {
    videoId: string;
    caption: string;
}

const captionSchema = new Schema<ICaption>({
    videoId: {type: String, required: true},
    caption: {type: String, required: true}
});

export const Caption = model<ICaption>("Caption", captionSchema);