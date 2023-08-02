const bodyparser = require("body-parser");

const xlsx = require("./xlsxHandler");

const multer = require("./multer");

const CRUD = require("./CRUD");

const express = require("express");

const pdfParser = require("pdf-parse");

const fs = require("fs");

const app = express();

const https = require("https");

const path = require("path");

const { MongoClient } = require("mongodb");

app.use(express.static(path.join(__dirname, "public")));

const uri =
  "mongodb+srv://kasinathansj:kasi%40home61@cluster0.gumlfqd.mongodb.net/?retryWrites=true&w=majority";

// const uri = "mongodb://localhost:27017/"

const client = new MongoClient(uri);

const port = 3000;

app.use(bodyparser.urlencoded({ extended: true }));

app.listen(port, async function (req) {
  console.log(`server is running on ${port}`);
  await client.connect();
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/homePage.html");
});
app.get("/studentLogin", function (req, res) {
  res.sendFile(__dirname + "/html/studentLogin.html");
});
app.get("/facultyLogin", function (req, res) {
  res.sendFile(__dirname + "/html/facultyLogin.html");
});
app.post("/facultyPage", async function (req, res) {
  const obj = await CRUD.findOne(client, "TEACHERS", {
    _id: req.body.facultyMailId,
  });
  console.log(obj);
  console.log(req.body);
  if (obj != null && obj.passWord === req.body.facultyPassword) {
    const facultyProfile = await CRUD.findOne(client, "TEACHERSDETAILS", {
      _id: req.body.facultyMailId,
    });
    res.render("facultyHome.ejs", facultyProfile);
  } else {
    res.sendFile(__dirname + "/html/failure.html");
  }
});
app.post("/studentPage", async function (req, res) {
  const val = await CRUD.findOne(client, "STUDENTS", {
    _id: req.body.stdMailId,
  });
  console.log(val);
  if (val == null || val.passWord != req.body.stdPassword) {
    res.sendFile(__dirname + "/html/failure.html");
  } else {
    const obj = await CRUD.findOne(client, "STUDENTSDETAILS", {
      _id: req.body.stdMailId,
    });
    console.log(obj);
    res.render("studentPage.ejs", obj);
  }
});
app.post("/semMarks", async function (req, res) {
  console.log(req.body);
  const obj = await CRUD.findOne(client, "STUDENTSDETAILS", {
    _id: req.body.stdMailId,
  });
  console.log(obj);
  if (obj != null) {
    res.render("markDetails.ejs", obj);
  } else {
    res.sendFile(__dirname + "/html/failure.html");
  }
});
app.post("/addStudent", (req, res) => {
  res.render("addStudent.ejs", req.body);
});

app.post("/attendance", (req, res) => {
  res.sendFile(__dirname + "/html/success.html");
});

app.post("/semesterMarks", (req, res) => {
  console.log(req.body);
  res.render("semesterMarks.ejs",req.body);
});

app.post("/myClass", async (req, res) => {
  const teacherMailId = req.body.mailId;
  const getStd = await CRUD.findOne(client, "TEACHERSDETAILS", {
    _id: teacherMailId,
  });
  const students = getStd.class;
  const studentsDetails = await CRUD.findMany(client,"STUDENTSDETAILS",{_id:{$in : students}});
  res.render("myClass.ejs",{studentsList:studentsDetails});
});

app.post("/viewMoreStudentDetails" , async (req , res) => {
  const record = JSON.parse(req.body.moreStudentDetails);
  res.render("moreStudentDetails.ejs",record);
})

app.post(
  "/addStudentSubmit",
  multer.upload.single("studentImage"),
  async function (req, res) {
    var img = fs.readFileSync(req.file.path);
    const base64 = btoa(String.fromCharCode(...img));
    var pic = {
      type: req.file.mimetype,
      path: req.file.path,
      binaryData: base64,
    };
    var getStd = await CRUD.findOne(client, "TEACHERSDETAILS", {
      _id: req.body.mailId,
    });
    if (getStd.class.indexOf(req.body.studentEmail) === -1) {
      getStd.class.push(req.body.studentEmail);
    }
    const result = await CRUD.updateOne(
      client,
      "TEACHERSDETAILS",
      { _id: req.body.mailId },
      getStd
    );
    await CRUD.updateOne(
      client,
      "STUDENTS",
      { _id: req.body.studentEmail },
      { _id: req.body.studentEmail, passWord: req.body.dateOfBirth }
    );
    req.body.image = pic;
    await CRUD.updateOne(
      client,
      "STUDENTSDETAILS",
      { _id: req.body.studentEmail },
      req.body
    );
    res.sendFile(__dirname+"/html/success.html");
  }
);

app.post("/semesterSubmit", multer.upload.single("pdfData"), async (req, res) => {

  var data  = xlsx.xlsxHandler(req);

  const teacherMailId = req.body.mailId;
  const getStd = await CRUD.findOne(client, "TEACHERSDETAILS", {
    _id: teacherMailId,
  });

  const students = getStd.class;
  const studentsDetails = await CRUD.findMany(client,"STUDENTSDETAILS",{_id:{$in : students}});

  const map = new Map();

  data.forEach(ele=>{
    const registerNo = ele.registerNo;
    delete ele.registerNo;
    delete ele.StudName;
    map.set(Number(registerNo) , ele);
  })

  studentsDetails.forEach(async (ele)=>{
    if(map.has(Number(ele.registerNo))){
      const studentGrades = (map.get(Number(ele.registerNo)))
      const studentToUpdate = ele;
      if(studentToUpdate.semester==null){
        studentToUpdate.semester = {}
      }
      const semNo = "sem"+studentGrades.semester;
      delete studentGrades.semester;
      if(!studentToUpdate.semester.hasOwnProperty(semNo)){
        studentToUpdate.semester[semNo] = {}
      }
      (Object.entries(studentGrades)).forEach(([key,value])=>{
        studentToUpdate.semester[semNo][key] = value
      })
      await CRUD.updateOne(
        client,
        "STUDENTSDETAILS",
        {registerNo:ele.registerNo},
        studentToUpdate
      )
    }
  });
  res.sendFile(__dirname+"/html/success.html");
});