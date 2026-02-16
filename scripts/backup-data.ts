import mongoose from 'mongoose';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

async function backupData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupDir = path.join(process.cwd(), 'backups', timestamp);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const collections = await mongoose.connection.db.collections();
    
    for (const collection of collections) {
      const data = await collection.find({}).toArray();
      const filename = path.join(backupDir, `${collection.collectionName}.json`);
      
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
      console.log(`✅ Backed up ${collection.collectionName}: ${data.length} documents`);
    }

    console.log(`✅ Backup complete! Location: ${backupDir}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

backupData();