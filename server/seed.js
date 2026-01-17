const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/military_assets");

(async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        name: "Admin",
        email: "admin@military.com",
        password: bcrypt.hashSync("Admin@123", 10),
        role: "ADMIN"
      },
      {
        name: "Commander",
        email: "commander@military.com",
        password: bcrypt.hashSync("Test@123", 10),
        role: "COMMANDER"
      },
      {
        name: "Logistics",
        email: "logistics@military.com",
        password: bcrypt.hashSync("Test@123", 10),
        role: "LOGISTICS"
      }
    ];

    await User.insertMany(users);
    console.log("Users Seeded Successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
