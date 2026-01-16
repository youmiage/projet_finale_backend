import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function validateCleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network');
    console.log('✅ Validation du nettoyage...');
    
    const db = mongoose.connection.db;
    
    // Récupérer tous les IDs d'utilisateurs valides
    const users = await db.collection('users').find({}).toArray();
    const userIds = users.map(u => u._id.toString());
    console.log(`👥 Utilisateurs valides: ${userIds.length}`);
    
    let totalOrphans = 0;
    
    // Vérifier chaque collection
    const collections = [
      { name: 'notifications', field: 'recipient' },
      { name: 'notifications', field: 'sender' },
      { name: 'settings', field: 'user' },
      { name: 'follows', field: 'follower' },
      { name: 'follows', field: 'following' },
      { name: 'threads', field: 'author' },
      { name: 'replies', field: 'author' },
      { name: 'likes', field: 'user' }
    ];
    
    for (const collection of collections) {
      const query = { [collection.field]: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) } };
      const count = await db.collection(collection.name).countDocuments(query);
      
      if (count > 0) {
        console.log(`⚠️  ${collection.name}: ${count} enregistrements orphelins (${collection.field})`);
        totalOrphans += count;
      }
    }
    
    if (totalOrphans === 0) {
      console.log('\n🎉 Parfait ! Aucun enregistrement orphelin détecté !');
      console.log('✅ Base de données parfaitement propre');
    } else {
      console.log(`\n❌ ${totalOrphans} enregistrements orphelins restants`);
      console.log('💡 Relancez le script de nettoyage');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error);
  } finally {
    await mongoose.disconnect();
  }
}

validateCleanup();
