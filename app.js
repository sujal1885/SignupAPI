const express = require("express");
const https = require("https");
const bodyParser=require("body-parser");
const request=require("request")

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){

    const firstName = req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;

    var data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };

    app.post("/failure",function(req,res){
        res.redirect("/");
    });

    var jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/1014a9e3f0";

    const options = {
        method:"POST",
        auth:"sujal:d8864b09279f1b96464d034fff7916c8-us11"
    }

    const request=https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.listen(3000,function(){
    console.log("server is running on port 3000.");
})
