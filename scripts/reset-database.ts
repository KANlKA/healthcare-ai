import mongoose from 'mongoose';
import { config } from 'dotenv';
import readline from 'readline';

config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    rl.question('⚠️  This will DELETE ALL DATA. Type "CONFIRM" to proceed: ', async (answer) => {
      if (answer === 'CONFIRM') {
        const collections = await mongoose.connection.db.collections();
        
        for (const collection of collections) {
          await collection.drop();
          console.log(`✅ Dropped collection: ${collection.collectionName}`);
        }
        
        console.log('✅ Database reset complete!');
      } else {
        console.log('❌ Reset cancelled.');
      }
      
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();