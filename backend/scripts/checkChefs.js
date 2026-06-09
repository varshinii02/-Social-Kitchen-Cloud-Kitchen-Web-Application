import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "../config/db.js";
import Chef from "../models/chefModel.js";

dotenv.config({ path: "../../.env" });

connectDB();

const checkChefs = async () => {
  try {
    const chefs = await Chef.find({});
    console.log(`Number of chefs found: ${chefs.length}`);
    chefs.forEach((chef) => {
      console.log(`Chef: ${chef.name}, Kitchen: ${chef.kitchenName}`);
    });
    process.exit();
  } catch (error) {
    console.error(`Error fetching chefs: ${error.message}`.red);
    process.exit(1);
  }
};

checkChefs();
