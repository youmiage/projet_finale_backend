import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function cleanupOrphanedNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network');
    console.log('🧹 Nettoyage des notifications orphelines...');
    
    const db = mongoose.connection.db;
    
    // 1. Récupérer tous les follows actifs (en_attente)
    const pendingFollows = await db.collection('follows').find({status: 'en_attente'}).toArray();
    const pendingFollowIds = pendingFollows.map(f => ({
      follower: f.follower.toString(),
      following: f.following.toString()
    }));
    
    console.log(`📋 Follows en attente trouvés: ${pendingFollowIds.length}`);
    
    // 2. Récupérer toutes les notifications follow_request
    const followRequestNotifs = await db.collection('notifications').find({type: 'follow_request'}).toArray();
    console.log(`📊 Notifications follow_request: ${followRequestNotifs.length}`);
    
    // 3. Identifier les notifications orphelines
    const orphanedNotifs = [];
    
    for (const notif of followRequestNotifs) {
      const hasCorrespondingFollow = pendingFollowIds.some(follow => 
        follow.follower === notif.sender.toString() && 
        follow.following === notif.recipient.toString()
      );
      
      if (!hasCorrespondingFollow) {
        orphanedNotifs.push(notif._id);
      }
    }
    
    console.log(`👻 Notifications orphelines identifiées: ${orphanedNotifs.length}`);
    
    // 4. Supprimer les notifications orphelines
    if (orphanedNotifs.length > 0) {
      const result = await db.collection('notifications').deleteMany({
        _id: { $in: orphanedNotifs }
      });
      
      console.log(`✅ Supprimé: ${result.deletedCount} notifications orphelines`);
    } else {
      console.log('✅ Aucune notification orpheline à supprimer');
    }
    
    // 5. Vérifier les autres types de notifications orphelines
    console.log('\n🔍 Vérification des autres notifications...');
    
    const users = await db.collection('users').find({}).toArray();
    const userIds = users.map(u => u._id.toString());
    
    const otherOrphaned = await db.collection('notifications').deleteMany({
      $or: [
        { recipient: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) } },
        { sender: { $nin: userIds.map(id => new mongoose.Types.ObjectId(id)) } }
      ]
    });
    
    if (otherOrphaned.deletedCount > 0) {
      console.log(`✅ Supprimé: ${otherOrphaned.deletedCount} autres notifications orphelines`);
    }
    
    console.log('\n🎯 Nettoyage terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await mongoose.disconnect();
  }
}

cleanupOrphanedNotifications();
