import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function cleanupOrphanedRecords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network');
    console.log('🧹 Nettoyage des enregistrements orphelins...');
    
    const db = mongoose.connection.db;
    
    // Récupérer tous les IDs d'utilisateurs valides
    const users = await db.collection('users').find({}).toArray();
    const userIds = users.map(u => u._id.toString());
    console.log(`👥 Utilisateurs valides trouvés: ${userIds.length}`);
    
    let totalDeleted = 0;
    
    // 1. Nettoyer les notifications orphelines (recipient et sender)
    console.log('\n🔔 Nettoyage des notifications orphelines...');
    const notifResult = await db.collection('notifications').deleteMany({
      $or: [
        { recipient: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) } },
        { sender: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) } }
      ]
    });
    console.log(`  ❌ Supprimé: ${notifResult.deletedCount} notifications orphelines`);
    totalDeleted += notifResult.deletedCount;
    
    // 2. Nettoyer les settings orphelins
    console.log('\n⚙️ Nettoyage des settings orphelins...');
    const settingsResult = await db.collection('settings').deleteMany({
      user: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) }
    });
    console.log(`  ❌ Supprimé: ${settingsResult.deletedCount} settings orphelins`);
    totalDeleted += settingsResult.deletedCount;
    
    // 3. Nettoyer les follows orphelins
    console.log('\n🤝 Nettoyage des follows orphelins...');
    const followResult = await db.collection('follows').deleteMany({
      $or: [
        { follower: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) } },
        { following: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) } }
      ]
    });
    console.log(`  ❌ Supprimé: ${followResult.deletedCount} follows orphelins`);
    totalDeleted += followResult.deletedCount;
    
    // 4. Nettoyer les threads orphelins
    console.log('\n📝 Nettoyage des threads orphelins...');
    const threadResult = await db.collection('threads').deleteMany({
      author: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) }
    });
    console.log(`  ❌ Supprimé: ${threadResult.deletedCount} threads orphelins`);
    totalDeleted += threadResult.deletedCount;
    
    // 5. Nettoyer les réponses orphelines
    console.log('\n💬 Nettoyage des réponses orphelines...');
    const threads = await db.collection('threads').find({}).toArray();
    const threadIds = threads.map(t => t._id.toString());
    
    const replyResult = await db.collection('replies').deleteMany({
      $or: [
        { author: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) } },
        { thread: { $nin: threadIds.map(id => new mongoose.Types.ObjectId(id)) } }
      ]
    });
    console.log(`  ❌ Supprimé: ${replyResult.deletedCount} réponses orphelines`);
    totalDeleted += replyResult.deletedCount;
    
    // 6. Nettoyer les likes orphelins
    console.log('\n❤️ Nettoyage des likes orphelins...');
    const likeResult = await db.collection('likes').deleteMany({
      user: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) }
    });
    console.log(`  ❌ Supprimé: ${likeResult.deletedCount} likes orphelins`);
    totalDeleted += likeResult.deletedCount;
    
    console.log(`\n🎯 Nettoyage terminé !`);
    console.log(`📊 Total supprimé: ${totalDeleted} enregistrements orphelins`);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await mongoose.disconnect();
  }
}

cleanupOrphanedRecords();
