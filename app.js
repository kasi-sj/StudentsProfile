const bodyparser = require("body-parser");

const express = require("express");

const app = express();

const https = require("https");

const path = require('path');

const {MongoClient} =  require("mongodb");

app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(3000, async function(req){
    
    console.log("server is running on 3000");
    
    await client.connect();

});

app.get("/" , function( req, res){

    res.sendFile(__dirname +"/html/index.html");

})

app.get("/login",function(req,res){

    res.sendFile(__dirname + "/html/login.html");

})

app.post("/studentPage" , async function(req,res){
    
    const val = await findOne(client,"users",Number(req.body.RegisterNo));
    
    if(val==null || val.PassWord!=req.body.password) {
    
        res.sendFile(__dirname+"/html/failure.html");
    
    }
    else{
    
        const obj = await findOne(client,"StudentDetails",Number(req.body.RegisterNo));
        console.log(obj);
        res.render("studentPage.ejs" ,obj);
    
    }
})

app.post("/semMarks/", async function(req , res){
    console.log(req.body);
    const obj = await findOne(client,"StudentDetails",Number(req.body.text));
    console.log(obj);
    res.send(obj)
    if(obj!=null){
        res.render("markDetails.ejs",obj);
    }else{
        res.sendFile(__dirname+"/html/failure.html");
    }
})