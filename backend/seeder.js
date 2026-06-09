import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import fooditems from "./data/fooditems.js";
import User from "./models/userModel.js";
import Fooditem from "./models/fooditemModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Fooditem.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    // Assign first user as admin
    const adminUser = createdUsers[0]._id;

    // Assign second user as chef for sample food items
    const chefUser = createdUsers[1]._id;

    // Assign some food items to admin user
    const adminFooditems = fooditems.slice(0, 3).map((fooditem) => {
      return { ...fooditem, user: adminUser };
    });

    // Assign remaining food items to chef user
    const chefFooditems = fooditems.slice(3).map((fooditem) => {
      return { ...fooditem, user: chefUser };
    });

    await Fooditem.insertMany([...adminFooditems, ...chefFooditems]);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Fooditem.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
