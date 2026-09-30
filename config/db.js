const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI est manquant dans le fichier .env');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connecté');
}
module.exports = connectDB;
