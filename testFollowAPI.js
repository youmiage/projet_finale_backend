// testFollowAPI.js - Tester l'API followers/following
import dotenv from "dotenv";
dotenv.config();

import followService from "./src/services/followService.js";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";

async function testAPI() {
  try {
    console.log("\n=== TEST API FOLLOWS ===\n");

    await connectDB();
    console.log("✓ Connecté à MongoDB\n");

    // Récupérer le premier utilisateur
    const testUser = await User.findOne().select("_id username");
    if (!testUser) {
      console.log("❌ Aucun utilisateur trouvé");
      process.exit(1);
    }

    console.log(
      `Test avec l'utilisateur: ${testUser.username} (${testUser._id})\n`
    );

    // Tester getFollowers
    console.log("--- getFollowers ---");
    const followers = await followService.getFollowers(testUser._id);
    console.log(`Résultat: ${JSON.stringify(followers, null, 2)}`);

    // Tester getFollowing
    console.log("\n--- getFollowing ---");
    const following = await followService.getFollowing(testUser._id);
    console.log(`Résultat: ${JSON.stringify(following, null, 2)}`);

    console.log("\n✓ Test terminé\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    console.error(error);
    process.exit(1);
  }
}

testAPI();
