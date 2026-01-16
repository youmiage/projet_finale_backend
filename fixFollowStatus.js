// fixFollowStatus.js - Convertir tous les "accepted" en "accepte"
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
import Follow from "./src/models/Follow.js";

async function fixFollowStatus() {
  try {
    console.log("\n=== CORRECTION DES STATUTS FOLLOW ===\n");

    await connectDB();
    console.log("✓ Connecté à MongoDB\n");

    // Mettre à jour tous les "accepted" en "accepte"
    const result = await Follow.updateMany(
      { status: "accepted" },
      { $set: { status: "accepte" } }
    );

    console.log(`Mises à jour: ${result.modifiedCount}`);
    console.log(`Correspondances: ${result.matchedCount}`);

    // Vérifier les nouveaux statuts
    const statusCounts = await Follow.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("\nStatuts après correction:");
    statusCounts.forEach((s) => {
      console.log(`  ${s._id}: ${s.count}`);
    });

    console.log("\n✓ Correction terminée\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    process.exit(1);
  }
}

fixFollowStatus();
