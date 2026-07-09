const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chats.js");
const methodOverride = require("method-override");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded( { extended: true }));
app.use(methodOverride("_method"));

//To set the connection with the mongodb database
main()
    .then(() => {
        console.log("connection is successful");
    })
    .catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//Index Route - show all chats
app.get("/chats",async (req,res) => {
    let chats = await Chat.find();
    res.render("index.ejs",{ chats });
});

//New Route - render form to add info for new chat
app.get("/chats/new",(req,res) => {
    res.render("new.ejs");
});

//Post Route
app.post("/chats",(req,res) => {
    let {from, to, msg} = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });
    newChat.save()
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        })
    res.redirect("/chats");
})

//Edit Route
app.get("/chats/:id/edit", async (req,res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs",{ chat });
})

//Update Route
app.put("/chats/:id",async (req,res) => {
    let { id } = req.params;
    let {msg: newMsg} = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id,
        {msg: newMsg,updated_at: new Date},
        {runValidators: true,new: true});
    res.redirect("/chats");
})

//Destroy Route
app.delete("/chats/:id",async (req,res) => {
    let { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
})

//Root route
app.get('/', (req, res) => {
  res.send('Working');
});

app.listen(8080, () => {
  console.log('Server is listening to port 8080');
});