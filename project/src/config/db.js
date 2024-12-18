const mongoose = require('mongoose');

const connectDB = async () => {
  // console.log("getting data", process.env.MONGODB_URI)
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/mobulous", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    

    console.log(`DataBase is connected succesfully: ${conn.connection.host}`);
  } catch (err) {
    console.error('DataBase connection error:', err.message);
    // Don't exit the process, let it retry
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;