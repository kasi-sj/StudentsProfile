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
async function findOne(client,table,value){

    const result = await client.db("kasi").collection(table).findOne({_id:value});

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
    
    const val = await findOne(client,"STUDENTS",Number(req.body.RegisterNo));
    console.log(val);
    if(val==null || val.passWord!=req.body.password) {
    
        res.sendFile(__dirname+"/html/failure.html");
    
    }
    else{
    
        const obj = await findOne(client,"STUDENTSDETAILS",Number(req.body.RegisterNo));
        console.log(obj);
        res.render("studentPage.ejs" ,obj);
    
    }
})

app.post("/semMarks", async function(req , res){
    console.log(req.body);
    const obj = await findOne(client,"STUDENTSDETAILS",Number(req.body.regNo));
    console.log(obj);
    if(obj!=null){
        res.render("markDetails.ejs",obj);
    }else{
        res.sendFile(__dirname+"/html/failure.html");
    }
})


//<script>
// async function markTrans(){
//     let regNo = document.getElementById("reg").innerText;
//     let data=new URLSearchParams();
//     data.append('text',regNo);
//     await fetch('/semMarks',{
//       method:'POST',
//       headers:{
//         'Content-Type':'application/x-www-form-urlencoded',
//       },
//       body:data.toString(),
//     });
  
//     }
   
 // </script>