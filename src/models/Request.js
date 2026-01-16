// backend/src/models/Request.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["password_reset", "email_verification"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
requestSchema.index({ token: 1 });
requestSchema.index({ expiresAt: 1 });

const Request = mongoose.model("Request", requestSchema);

export default Request;
