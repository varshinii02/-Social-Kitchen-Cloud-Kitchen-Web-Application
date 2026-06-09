import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@socialkitchen.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
    phone: "1234567890",
  },
  {
    name: "Shikha Singh",
    email: "shikha@socialkitchen.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "1234567891",
  },
  {
    name: "Sumanth Sai",
    email: "sumanth@socialkitchen.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "1234567892",
  },
  {
    name: "Janani",
    email: "janani@socialkitchen.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "1234567893",
  },
  {
    name: "Deepa",
    email: "deepa@socialkitchen.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "1234567894",
  },
  {
    name: "Ravindra",
    email: "ravindra@socialkitchen.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "1234567895",
  },
  {
    name: "kaushik",
    email: "kaushik@socialkitchen.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "1234567896",
  },
];

export default users;
