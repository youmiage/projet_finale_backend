// diagnostic.js - Test des endpoints follows
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";
import Follow from "./src/models/Follow.js";

async function runDiagnostic() {
  try {
    console.log("\n=== DIAGNOSTIC ABONNÉS/ABONNEMENTS ===\n");

    // Connexion à la base
    await connectDB();
    console.log("✓ Connecté à MongoDB\n");

    // 1. Vérifier les utilisateurs
    const users = await User.find().select(
      "username email isPrivate followersCount followingCount"
    );
    console.log(`Utilisateurs trouvés: ${users.length}`);
    users.slice(0, 5).forEach((u) => {
      console.log(
        `  - ${u.username} (privé: ${u.isPrivate}, followers: ${u.followersCount}, following: ${u.followingCount})`
      );
    });

    // 2. Vérifier les relations de suivi
    const follows = await Follow.find()
      .populate("follower", "username")
      .populate("following", "username");
    console.log(`\nRelations de suivi: ${follows.length}`);
    follows.slice(0, 10).forEach((f) => {
      console.log(
        `  ${f.follower.username} → ${f.following.username} (status: ${f.status})`
      );
    });

    // 3. Compter par statut
    const statusCounts = await Follow.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log("\nStatuts des relations:");
    statusCounts.forEach((s) => {
      console.log(`  ${s._id}: ${s.count}`);
    });

    // 4. Tester avec le premier utilisateur
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n--- Test avec l'utilisateur: ${testUser.username} ---`);

      // Followers
      const followers = await Follow.find({
        following: testUser._id,
        status: "accepte",
      }).populate("follower", "username name");
      console.log(`Abonnés (accepte): ${followers.length}`);
      followers.slice(0, 3).forEach((f) => {
        console.log(`  - ${f.follower.username}`);
      });

      // Following
      const following = await Follow.find({
        follower: testUser._id,
        status: "accepte",
      }).populate("following", "username name");
      console.log(`Abonnements (accepte): ${following.length}`);
      following.slice(0, 3).forEach((f) => {
        console.log(`  - ${f.following.username}`);
      });
    }

    console.log("\n✓ Diagnostic terminé\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    process.exit(1);
  }
}

runDiagnostic();
