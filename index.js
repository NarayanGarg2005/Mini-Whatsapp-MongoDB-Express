const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chats.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

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
app.get("/chats",async (req,res,next) => {
    try {
        let chats = await Chat.find();
        res.render("index.ejs",{ chats });
    } 
    catch(err) {
        next(err);
    }
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
app.get("/chats/:id/edit", async (req,res,next) => {
    try {
        let { id } = req.params;
        let chat = await Chat.findById(id);
        if(!chat) {
            return next(new ExpressError(404,"Chat not found"));
        }
        res.render("edit.ejs",{ chat });
    }
    catch(err) {
        next(err);
    }
})

//Update Route
app.put("/chats/:id",async (req,res,next) => {
    try {
        let { id } = req.params;
        let {msg: newMsg} = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id,
            {msg: newMsg,updated_at: new Date},
            {runValidators: true,new: true});
        res.redirect("/chats");
    }
    catch(err) {
        next(err);
    }
})

//Destroy Route
app.delete("/chats/:id",async (req,res,next) => {
    try {
        let { id } = req.params;
        await Chat.findByIdAndDelete(id);
        res.redirect("/chats");
    }
    catch(err) {
        next(err);
    }
})

//Root route
app.get('/', (req, res) => {
  res.send('Working');
});

//Error Handling Middleware
app.use((err,req,res,next) => {
    let { status=500, message="Some error occured"} = err;
    res.status(status).send(message);
})

app.listen(8080, () => {
  console.log('Server is listening to port 8080');
});