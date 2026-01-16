// backend/src/models/Settings.js
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Préférences de notifications
    notifications: {
      email: {
        newFollower: {
          type: Boolean,
          default: true,
        },
        followRequest: {
          type: Boolean,
          default: true,
        },
        followAccepted: {
          type: Boolean,
          default: true,
        },
        threadLike: {
          type: Boolean,
          default: true,
        },
        threadReply: {
          type: Boolean,
          default: true,
        },
        mention: {
          type: Boolean,
          default: true,
        },
      },
      push: {
        newFollower: {
          type: Boolean,
          default: true,
        },
        followRequest: {
          type: Boolean,
          default: true,
        },
        followAccepted: {
          type: Boolean,
          default: true,
        },
        threadLike: {
          type: Boolean,
          default: true,
        },
        threadReply: {
          type: Boolean,
          default: true,
        },
        mention: {
          type: Boolean,
          default: true,
        },
      },
      inApp: {
        newFollower: {
          type: Boolean,
          default: true,
        },
        followRequest: {
          type: Boolean,
          default: true,
        },
        followAccepted: {
          type: Boolean,
          default: true,
        },
        threadLike: {
          type: Boolean,
          default: true,
        },
        threadReply: {
          type: Boolean,
          default: true,
        },
        mention: {
          type: Boolean,
          default: true,
        },
        contentValidated: {
          type: Boolean,
          default: true,
        },
        contentFlagged: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Paramètres de confidentialité
    privacy: {
      whoCanFollowMe: {
        type: String,
        enum: ["everyone", "friends_of_friends", "nobody"],
        default: "everyone",
      },
      whoCanSeeMyPosts: {
        type: String,
        enum: ["everyone", "followers", "only_me"],
        default: "everyone",
      },
      whoCanMentionMe: {
        type: String,
        enum: ["everyone", "followers", "nobody"],
        default: "everyone",
      },
      showOnlineStatus: {
        type: Boolean,
        default: true,
      },
      showActivityStatus: {
        type: Boolean,
        default: true,
      },
      allowDirectMessages: {
        type: String,
        enum: ["everyone", "followers", "people_i_follow", "nobody"],
        default: "everyone",
      },
    },

    // Préférences d'affichage
    display: {
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "light",
      },
      language: {
        type: String,
        enum: ["fr", "ar", "en"],
        default: "fr",
      },
      fontSize: {
        type: String,
        enum: ["small", "medium", "large"],
        default: "medium",
      },
      showSensitiveContent: {
        type: Boolean,
        default: false,
      },
    },

    // Préférences de contenu
    content: {
      autoplayVideos: {
        type: Boolean,
        default: true,
      },
      showMediaPreviews: {
        type: Boolean,
        default: true,
      },
      enableMentions: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
settingsSchema.index({ user: 1 });

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
