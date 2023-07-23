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

async function findOne(client,table, username){
    const result = await client.db("kasi").collection(table).findOne({_id:username});
    return result;
}

app.use(bodyparser.urlencoded({extended:true}));
app.use( express.static( "public"));

app.listen(3000, async function(req){
    console.log("server is running on 3000");
    await client.connect();
});

app.get("/" , function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.get("/login",function(req,res){
    res.sendFile(__dirname+"/login.html");
})

app.post("/studentpage" , async function(req,res){
    const val = await findOne(client,"users",Number(req.body.RegisterNo));
    console.log(val);
    console.log(req.body);
    if(val==null || val.PassWord!=req.body.password)
    res.sendFile(__dirname+"/failure.html");
    else{
        const obj = await findOne(client,"StudentDetails",Number(req.body.RegisterNo));
        res.render("studentpage.ejs" ,obj);
    }
})

