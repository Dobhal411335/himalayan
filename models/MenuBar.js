import { Schema, models, model } from "mongoose";
import Room from "@/models/Room"
import RoomAmenities from '@/models/RoomAmenities';
import RoomPrice from '@/models/RoomPrice';
import RoomReview from '@/models/RoomReview';
const MenuBarSchema = new Schema(
    {
        active: { type: Boolean },
        order: { type: Number },
        title: { type: String },
        subMenu: [
            {
                title: { type: String },
                url: { type: String },
                active: { type: Boolean },
                order: { type: Number },
                banner: { url: { type: String }, key: { type: String } },
                profileImage: { url: { type: String }, key: { type: String } },
                rooms: { type: [Schema.Types.ObjectId], ref: "Room", default: [] },
            }
        ]
    },
    { timestamps: true }
);

export default models.MenuBar || model("MenuBar", MenuBarSchema);
