//backend/src/models/Thread.js
import mongoose from "mongoose";

const threadSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Le contenu est requis"],
      maxlength: [500, "Le contenu ne peut pas dépasser 500 caractères"],
      trim: true,
    },
    media: {
      url: {
        type: String,
        default: null,
      },
      type: {
        type: String,
        enum: ["image", "video"],
        default: null,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour améliorer les performances
threadSchema.index({ author: 1, createdAt: -1 });
threadSchema.index({ createdAt: -1 });
threadSchema.index({ likes: 1 });

// Virtual pour compter les likes
threadSchema.virtual("likesCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Virtual pour compter les réponses
threadSchema.virtual("repliesCount").get(function () {
  return this.replies ? this.replies.length : 0;
});

const Thread = mongoose.model("Thread", threadSchema);

export default Thread;
