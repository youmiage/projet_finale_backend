// backend/src/models/Follow.js
import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["en_attente", "accepte", "refuse", "bloque"],
      default: "en_attente",
    },
  },
  { timestamps: true }
);
const Follow = mongoose.model("Follow", followSchema);

export default Follow;
