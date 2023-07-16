const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const https = require("https");
const {MongoClient} =  require("mongodb");

const uri = "mongodb+srv://kasinathansj:kasi%40home61@cluster0.gumlfqd.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb://localhost:27017/"
const client = new MongoClient(uri);


async function insertOne(client , data){
    const results = await client.db("kasi").collection("users").insertOne(data);
    console.log(results);
}

async function findOne(client, username){
    const result = await client.db("kasi").collection("users").findOne({username:username});
    return result;
}

app.use(bodyparser.urlencoded({extended:true}));
app.use( express.static( __dirname + '/' ));

app.listen(3000, async function(req){
    console.log("server is running on 3000");
    await client.connect();
});

app.get("/" , function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/" , async function(req,res){
    const val = await findOne(client,req.body.username);
    console.log(val+req.body.username);
    if(val==null || val.password!=req.body.password)
    res.sendFile(__dirname+"/failure.html");
    else
    res.sendFile(__dirname+"/success.html");
})
