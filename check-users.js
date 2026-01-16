import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network')
  .then(async () => {
    console.log('🔍 Analyse détaillée des utilisateurs...');
    
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    users.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}: ${user.username}`);
      console.log(`   • ID: ${user._id}`);
      console.log(`   • Email: ${user.email}`);
      console.log(`   • Nom: ${user.name || 'NON DÉFINI'}`);
      console.log(`   • Bio: ${user.bio || 'NON DÉFINI'}`);
      console.log(`   • Location: ${user.location || 'NON DÉFINI'}`);
      console.log(`   • Website: ${user.website || 'NON DÉFINI'}`);
      console.log(`   • Hobbies: ${user.hobbies ? user.hobbies.length : 0} éléments`);
      if (user.hobbies && user.hobbies.length > 0) {
        console.log(`     - ${user.hobbies.join(', ')}`);
      }
      console.log(`   • BirthDate: ${user.birthDate || 'NON DÉFINI'}`);
      console.log(`   • ProfilePicture: ${user.profilePicture ? 'DÉFINI' : 'NON DÉFINI'}`);
      console.log(`   • CoverImage: ${user.coverImage || 'NON DÉFINI'}`);
      console.log(`   • IsPrivate: ${user.isPrivate}`);
      console.log(`   • FollowersCount: ${user.followersCount || 0}`);
      console.log(`   • FollowingCount: ${user.followingCount || 0}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Analyse terminée !');
  })
  .catch(console.error);
