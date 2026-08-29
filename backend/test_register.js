const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');

const uri = 'mongodb://admin:Varshi%402005@ac-1jr6zuv-shard-00-00.iedjvll.mongodb.net:27017,ac-1jr6zuv-shard-00-01.iedjvll.mongodb.net:27017,ac-1jr6zuv-shard-00-02.iedjvll.mongodb.net:27017/spendwiser?ssl=true&replicaSet=atlas-mr34q2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB");
    
    const email = `test_${Date.now()}@example.com`;
    const password = "password123";
    const name = "Test User";

    try {
      console.log(`Checking if user exists: ${email}`);
      const existingUser = await User.findOne({ email });
      console.log("Existing user check completed:", existingUser);

      console.log("Creating new user instance...");
      const newUser = new User({
        id: uuidv4(),
        email,
        password,
        name,
      });

      console.log("Saving user to DB...");
      await newUser.save();
      console.log("User saved successfully!");

      // Cleanup
      await User.deleteOne({ email });
      console.log("Test user cleaned up successfully!");
      process.exit(0);
    } catch (e) {
      console.error("Operation failed:", e);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
