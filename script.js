const express = require("express");
const app = express()
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const { fileLoader } = require("ejs");
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{

    fs.readdir(`./files`,(err, files)=>{
      res.render("index",{files:files})
    })

})

app.post("/create",(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}`,req.body.textarea,(err)=>{
        res.redirect("/")
    })

})

app.get("/file/:filename",(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,filedata)=>{
        res.render("show",{filename:req.params.filename , filedata:filedata})
    })

})

app.get("/edit/:filename",(req,res)=>{
    
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,filedata)=>{

        res.render("edit",{filename:req.params.filename,filedata:filedata})
    })

})

app.post("/edit/:filename", (req, res) => {

    const oldFilename = req.params.filename;

    const newFilename = req.body.title.split(" ").join("") ;

    fs.rename(
        `./files/${oldFilename}`,
        `./files/${newFilename}`,
        (err) => {

            if (err) return res.send(err);

            fs.writeFile(
                `./files/${newFilename}`,
                req.body.textarea,
                (err) => {

                    if (err) return res.send(err);

                    res.redirect("/");

                }
            );

        }
    );

});

app.listen(6969,function(){
    console.log("working")
});

