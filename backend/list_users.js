const mongoose = require('mongoose');
const User = require('./models/User');

const uri = 'mongodb://admin:Varshi%402005@ac-1jr6zuv-shard-00-00.iedjvll.mongodb.net:27017,ac-1jr6zuv-shard-00-01.iedjvll.mongodb.net:27017,ac-1jr6zuv-shard-00-02.iedjvll.mongodb.net:27017/spendwiser?ssl=true&replicaSet=atlas-mr34q2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(async () => {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    console.log("Users in DB:");
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
