import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "https://i.pinimg.com/originals/71/f3/51/71f3519243d136361d81df71724c60a0.png"
        }
    },
    { timestamps: true }
)

export const User = mongoose.model("User", userSchema)