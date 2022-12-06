const { rejects } = require("assert");
const express = require("express");
const path = require('path');
const final = require("./final.js");



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


let port = process.env.PORT || 8080;

let onStart = function (){
    console.log(`Express http server listening on ${port}`);
}

app.get("/",(request,response)=>{
    response.sendFile(path.join(__dirname,"/finalViews/home.html"));
});

app.get("/register",(request,response)=>{
    response.sendFile(path.join(__dirname,"/finalViews/register.html"));
});

app.post("/register",(request,response)=>{
    console.log(request.body);
    final.register(request.body).then(()=>{
        response.send(`${request.body.email} registered successfully` + `<p><a href="/">Go Home</a></p>`)
    }).catch((error)=>{response.send(error)});
});

app.get("/signIn",(request,response)=>{
    response.sendFile(path.join(__dirname,"/finalViews/signIn.html"));
});

app.post("/signIn",(request,response)=>{
    console.log(request.body);
    final.signIn(request.body).then(()=>{
        response.send(`${request.body.email} signed in successfully` + `<p><a href="/">Go Home</a></p>`)
    }).catch((error)=>{response.send(error)});
});


app.use(function (request, response) {
    response.status(404).send("<h1>Not Found</h1>");
  });


final.startDB().then(function () {
    app.listen(port, onStart);
  })
  .catch(function (err) {
    console.log('Failed to start!' + err);
  });