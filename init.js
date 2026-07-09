//this file is made to Initialise the database with some data

const mongoose = require("mongoose");
const Chat = require("./models/chats.js");

//To set the connection with the mongodb database
main()
    .then(() => {
        console.log("connection is successful");
    })
    .catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats = [
    {
        from: "neha",
        to: "priya",
        msg: "send me your examsheets",
        created_at: new Date()
    },
        {
        from: "ram",
        to: "shyam",
        msg: "share me your experience",
        created_at: new Date()
    },
    {
        from: "sita",
        to: "gita",
        msg: "send me the pdf",
        created_at: new Date()
    },
    {
        from: "rahul",
        to: "preet",
        msg: "can we meet in the evening?",
        created_at: new Date()
    },
    {
        from: "sonam",
        to: "pooja",
        msg: "hello! how are you?",
        created_at: new Date()
    },
    {
        from: "harish",
        to: "aman",
        msg: "we are best friends",
        created_at: new Date()
    },
];

Chat.insertMany(allChats);