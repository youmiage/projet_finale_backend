import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const sampleHobbies = [
  'sport', 'musique', 'lecture', 'voyage', 'cuisine', 
  'photographie', 'informatique', 'jeux vidéo', 'cinéma', 'art',
  'danse', 'jardinage', 'écriture', 'randonnée', 'yoga'
];

const sampleBios = [
  'Passionné par la vie et les nouvelles aventures.',
  'Curieux et toujours prêt à apprendre de nouvelles choses.',
  'Créatif dans l\'âme et ouvert aux nouvelles expériences.',
  'Amateur de technologie et d\'innovation.',
  'Amateur de culture et de découvertes.',
  'Toujours positif et prêt à partager de bons moments.'
];

const sampleWebsites = [
  'https://portfolio.example.com',
  'https://blog.example.com',
  'https://github.com/example',
  'https://behance.net/example',
  'https://linkedin.com/in/example',
  ''
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network')
  .then(async () => {
    console.log('🔧 Ajout des données manquantes...');
    
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    for (const user of users) {
      const updates = {};
      
      // Ajouter une bio si manquante
      if (!user.bio || user.bio === '') {
        updates.bio = sampleBios[Math.floor(Math.random() * sampleBios.length)];
      }
      
      // Ajouter un site web si manquant (1 chance sur 3 d'en avoir un)
      if (!user.website || user.website === '') {
        if (Math.random() < 0.3) {
          updates.website = sampleWebsites[Math.floor(Math.random() * (sampleWebsites.length - 1))];
        }
      }
      
      // Ajouter des hobbies si manquants
      if (!user.hobbies || user.hobbies.length === 0) {
        const numHobbies = Math.floor(Math.random() * 4) + 1; // 1-4 hobbies
        const shuffled = [...sampleHobbies].sort(() => 0.5 - Math.random());
        updates.hobbies = shuffled.slice(0, numHobbies);
      }
      
      // Ajouter une date de naissance si manquante
      if (!user.birthDate) {
        const year = Math.floor(Math.random() * 30) + 1980; // 1980-2010
        const month = Math.floor(Math.random() * 12);
        const day = Math.floor(Math.random() * 28) + 1;
        updates.birthDate = new Date(year, month, day);
      }
      
      // Appliquer les mises à jour
      if (Object.keys(updates).length > 0) {
        await mongoose.connection.db.collection('users').updateOne(
          { _id: user._id },
          { $set: updates }
        );
        console.log(`✅ Mise à jour de ${user.username}:`, Object.keys(updates));
      }
    }
    
    console.log('\n🎉 Données ajoutées avec succès !');
    
    // Vérification finale
    console.log('\n🔍 Vérification finale...');
    const updatedUsers = await mongoose.connection.db.collection('users').find({}).toArray();
    
    updatedUsers.forEach((user, index) => {
      console.log(`\n👤 ${user.username}:`);
      console.log(`   • Bio: ${user.bio ? 'DÉFINIE' : 'NON DÉFINIE'}`);
      console.log(`   • Website: ${user.website ? 'DÉFINI' : 'NON DÉFINI'}`);
      console.log(`   • Hobbies: ${user.hobbies ? user.hobbies.length : 0} éléments`);
      console.log(`   • BirthDate: ${user.birthDate ? 'DÉFINIE' : 'NON DÉFINIE'}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Terminé !');
  })
  .catch(console.error);
