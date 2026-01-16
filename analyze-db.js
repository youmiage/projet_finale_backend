import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function analyzeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network');
    console.log('🔍 Analyse de la base de données...');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Collections trouvées:');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`  • ${collection.name}: ${count} documents`);
    }
    
    console.log('\n🔍 Analyse détaillée...');
    
    // Vérifier les utilisateurs
    const users = await db.collection('users').find({}).toArray();
    console.log(`\n👥 Utilisateurs (${users.length}):`);
    
    // Vérifier les champs manquants ou incohérents
    const userIssues = [];
    let usersWithPrivate = 0;
    let usersWithVerified = 0;
    
    users.forEach(user => {
      if (!user.username) userIssues.push('username manquant');
      if (!user.email) userIssues.push('email manquant');
      if (!user.password) userIssues.push('password manquant');
      if (typeof user.followersCount !== 'number') userIssues.push('followersCount invalide');
      if (typeof user.followingCount !== 'number') userIssues.push('followingCount invalide');
      if (typeof user.threadsCount !== 'number') userIssues.push('threadsCount invalide');
      if (user.isPrivate) usersWithPrivate++;
      if (user.isVerified) usersWithVerified++;
    });
    
    console.log(`  🔒 Comptes privés: ${usersWithPrivate}/${users.length}`);
    console.log(`  ✅ Comptes vérifiés: ${usersWithVerified}/${users.length}`);
    
    if (userIssues.length > 0) {
      console.log('  ⚠️  Problèmes détectés:', userIssues.slice(0, 5).join(', '));
    } else {
      console.log('  ✅ Structure des utilisateurs cohérente');
    }
    
    // Vérifier les follows
    const follows = await db.collection('follows').find({}).toArray();
    console.log(`\n🤝 Relations de suivi (${follows.length}):`);
    
    const followIssues = [];
    const statusCounts = {};
    let orphanFollows = 0;
    
    for (const follow of follows) {
      if (!follow.follower) followIssues.push('follower manquant');
      if (!follow.following) followIssues.push('following manquant');
      if (!follow.status) followIssues.push('status manquant');
      
      statusCounts[follow.status] = (statusCounts[follow.status] || 0) + 1;
      
      // Vérifier si les utilisateurs existent
      const followerExists = users.some(u => u._id.toString() === follow.follower?.toString());
      const followingExists = users.some(u => u._id.toString() === follow.following?.toString());
      
      if (!followerExists || !followingExists) {
        orphanFollows++;
      }
    }
    
    console.log('  📈 Répartition des statuts:', statusCounts);
    console.log(`  👻 Relations orphelines: ${orphanFollows}`);
    
    if (followIssues.length > 0) {
      console.log('  ⚠️  Problèmes détectés:', followIssues.slice(0, 3).join(', '));
    } else {
      console.log('  ✅ Structure des follows cohérente');
    }
    
    // Vérifier les threads
    const threads = await db.collection('threads').find({}).toArray();
    console.log(`\n📝 Threads (${threads.length}):`);
    
    const threadIssues = [];
    let orphanThreads = 0;
    let threadsWithMedia = 0;
    
    for (const thread of threads) {
      if (!thread.author) threadIssues.push('author manquant');
      if (!thread.content) threadIssues.push('content manquant');
      
      const authorExists = users.some(u => u._id.toString() === thread.author?.toString());
      if (!authorExists) orphanThreads++;
      
      if (thread.media && thread.media.url) threadsWithMedia++;
    }
    
    console.log(`  🖼️  Threads avec média: ${threadsWithMedia}/${threads.length}`);
    console.log(`  👻 Threads orphelins: ${orphanThreads}`);
    
    if (threadIssues.length > 0) {
      console.log('  ⚠️  Problèmes détectés:', threadIssues.slice(0, 3).join(', '));
    } else {
      console.log('  ✅ Structure des threads cohérente');
    }
    
    // Vérifier les notifications
    const notifications = await db.collection('notifications').find({}).toArray();
    console.log(`\n🔔 Notifications (${notifications.length}):`);
    
    const notifIssues = [];
    const typeCounts = {};
    let orphanNotifications = 0;
    
    for (const notif of notifications) {
      if (!notif.recipient) notifIssues.push('recipient manquant');
      if (!notif.type) notifIssues.push('type manquant');
      
      typeCounts[notif.type] = (typeCounts[notif.type] || 0) + 1;
      
      const recipientExists = users.some(u => u._id.toString() === notif.recipient?.toString());
      if (!recipientExists) orphanNotifications++;
    }
    
    console.log('  📈 Types de notifications:', typeCounts);
    console.log(`  👻 Notifications orphelines: ${orphanNotifications}`);
    
    if (notifIssues.length > 0) {
      console.log('  ⚠️  Problèmes détectés:', notifIssues.slice(0, 3).join(', '));
    } else {
      console.log('  ✅ Structure des notifications cohérente');
    }
    
    // Vérifier les settings
    const settings = await db.collection('settings').find({}).toArray();
    console.log(`\n⚙️  Paramètres (${settings.length}):`);
    
    let orphanSettings = 0;
    
    if (settings.length > 0) {
      const settingsIssues = [];
      
      settings.forEach(setting => {
        if (!setting.user) settingsIssues.push('user manquant');
        
        const userExists = users.some(u => u._id.toString() === setting.user?.toString());
        if (!userExists) orphanSettings++;
      });
      
      console.log(`  👻 Settings orphelins: ${orphanSettings}`);
      
      if (settingsIssues.length > 0) {
        console.log('  ⚠️  Problèmes détectés:', settingsIssues.join(', '));
      } else {
        console.log('  ✅ Structure des settings cohérente');
      }
    }
    
    // Vérifier les réponses
    const replies = await db.collection('replies').find({}).toArray();
    console.log(`\n💬 Réponses (${replies.length}):`);
    
    let orphanReplies = 0;
    
    if (replies.length > 0) {
      const replyIssues = [];
      
      for (const reply of replies) {
        if (!reply.author) replyIssues.push('author manquant');
        if (!reply.thread) replyIssues.push('thread manquant');
        if (!reply.content) replyIssues.push('content manquant');
        
        const authorExists = users.some(u => u._id.toString() === reply.author?.toString());
        const threadExists = threads.some(t => t._id.toString() === reply.thread?.toString());
        
        if (!authorExists || !threadExists) orphanReplies++;
      }
      
      console.log(`  👻 Réponses orphelines: ${orphanReplies}`);
      
      if (replyIssues.length > 0) {
        console.log('  ⚠️  Problèmes détectés:', replyIssues.slice(0, 3).join(', '));
      } else {
        console.log('  ✅ Structure des réponses cohérente');
      }
    }
    
    // Résumé
    console.log('\n📋 RÉSUMÉ DE L\'ANALYSE:');
    console.log('========================');
    
    const totalIssues = userIssues.length + followIssues.length + threadIssues.length + notifIssues.length;
    const totalOrphans = orphanFollows + orphanThreads + orphanNotifications + orphanSettings + orphanReplies;
    
    if (totalIssues === 0 && totalOrphans === 0) {
      console.log('🎉 Base de données parfaitement cohérente !');
    } else {
      console.log(`⚠️  ${totalIssues} problèmes de structure détectés`);
      console.log(`👻 ${totalOrphans} enregistrements orphelins détectés`);
      
      if (totalOrphans > 0) {
        console.log('\n💡 Suggestions:');
        console.log('  • Nettoyer les enregistrements orphelins');
        console.log('  • Vérifier les suppressions en cascade');
        console.log('  • Ajouter des contraintes de référence');
      }
    }
    
    console.log('\n🎯 Analyse terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
  } finally {
    await mongoose.disconnect();
  }
}

analyzeDatabase();
