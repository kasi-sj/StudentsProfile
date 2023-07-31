const bodyparser = require("body-parser");

const express = require("express");

const app = express();

const https = require("https");

const path = require('path');

const multer = require("multer");

const fs = require("fs");

const PDFParser = require('pdf-parse');

const storage = multer.diskStorage({
    destination :(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename :(req,file,cb)=>{
        cb(null,
            // file.fieldname+'-'+Date.now()+
            "sample"+path.extname(file.originalname));
    }
})
const upload = multer({
    storage:storage
});

app.post("/profileUpload",upload.single("profilePic") ,async (req,res)=>{
    console.log("hi");
    const img = fs.readFileSync(req.file.path);
    PDFParser(img).then(function(data) {
        console.log(data.text);
    });
     const base64 = btoa(String.fromCharCode(...img));
    // var profile = {
    //     type : req.file.mimetype,
    //     filepath : req.file.path,
    //     image :  base64
    // }
    // await updateOne(client ,921321104135, profile);
    // const obj = await findOne(client,"images" ,5);
    // obj.image = obj.image.toString("base64")
    // res.render("fileRetrival.ejs",obj);
    res.send("hai");
})

app.get("/" , function( req, res){

    res.sendFile(__dirname +"/fileUpload.html");

})

const {MongoClient} =  require("mongodb");

const uri = "mongodb+srv://kasinathansj:kasi%40home61@cluster0.gumlfqd.mongodb.net/?retryWrites=true&w=majority";

// const uri = "mongodb://localhost:27017/"

const client = new MongoClient(uri);

async function updateOne(client,_id,img){
    //can also use upsert => create if not exist
    const cursor = await client.db("kasi").collection("STUDENTSDETAILS").updateOne(
      {_id:_id},
      {$set:{img:img}},
      // {upsert : true}
      );
    console.log(cursor);
  }

async function insertOne(client , data){
  
    const results = await client.db("kasi").collection("images").insertOne(data);
  
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

