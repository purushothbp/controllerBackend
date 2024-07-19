const mongoose = require('mongoose');

async function dropIndex() {
  try {
    await mongoose.connect('mongodb+srv://bpurushothamandasu:9m9dzAUySJXD6AP4@controller.pxzh3i0.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.collection('users').dropIndex('googleId_1');
    console.log('Index dropped');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error dropping index:', error);
  }
}

dropIndex();
