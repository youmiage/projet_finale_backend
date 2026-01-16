// backend/src/models/Reply.js
import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Le contenu est requis"],
      maxlength: [500, "Le contenu ne peut pas dépasser 500 caractères"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
replySchema.index({ thread: 1, createdAt: -1 });

const Reply = mongoose.model("Reply", replySchema);

export default Reply;
