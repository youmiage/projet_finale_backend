import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network')
  .then(async () => {
    console.log('🧪 Test des données du profil...');
    
    // Récupérer un utilisateur au hasard
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    const testUser = users[0]; // Prendre le premier utilisateur
    
    if (testUser) {
      console.log(`\n👤 Test avec l'utilisateur: ${testUser.username}`);
      
      // Simuler la méthode getPublicProfile
      const publicProfile = {
        id: testUser._id,
        username: testUser.username,
        name: testUser.name || testUser.username,
        email: testUser.email,
        bio: testUser.bio,
        profilePicture: testUser.profilePicture,
        coverImage: testUser.coverImage,
        location: testUser.location,
        website: testUser.website,
        hobbies: testUser.hobbies,
        birthDate: testUser.birthDate,
        isPrivate: testUser.isPrivate,
        isVerified: testUser.isVerified,
        language: testUser.language,
        followersCount: testUser.followersCount,
        followingCount: testUser.followingCount,
        threadsCount: testUser.threadsCount,
        createdAt: testUser.createdAt,
      };
      
      console.log('\n📋 Données du profil public:');
      console.log(`   • Nom: ${publicProfile.name}`);
      console.log(`   • Bio: ${publicProfile.bio || 'NON DÉFINIE'}`);
      console.log(`   • Location: ${publicProfile.location || 'NON DÉFINIE'}`);
      console.log(`   • Website: ${publicProfile.website || 'NON DÉFINI'}`);
      console.log(`   • Hobbies: ${publicProfile.hobbies ? publicProfile.hobbies.length : 0} éléments`);
      if (publicProfile.hobbies && publicProfile.hobbies.length > 0) {
        console.log(`     - ${publicProfile.hobbies.join(', ')}`);
      }
      console.log(`   • BirthDate: ${publicProfile.birthDate ? new Date(publicProfile.birthDate).toLocaleDateString('fr-FR') : 'NON DÉFINIE'}`);
      console.log(`   • IsPrivate: ${publicProfile.isPrivate}`);
      console.log(`   • Followers: ${publicProfile.followersCount}`);
      console.log(`   • Following: ${publicProfile.followingCount}`);
      
      console.log('\n✅ Test réussi ! Les données sont complètes.');
    } else {
      console.log('❌ Aucun utilisateur trouvé pour le test');
    }
    
    await mongoose.disconnect();
  })
  .catch(console.error);
