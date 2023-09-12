import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port= 3000;

app.use(bodyParser.urlencoded({extended:true}));
var authorized =false;

function checker(req,res,next){
    const {password} = req.body;
    if(password==="ILoveProgramming")
        authorized =true;
    next();
}
app.use(checker);

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
})

app.post("/check", (req, res)=>{
    if(authorized)
        res.sendFile(__dirname + "/public/secret.html");
    else
        res.sendFile(__dirname+"/public/index.html"); //or res.redirect("/");
})

app.listen(port, ()=>{
    console.log("SERVER IS UP AND RUNNING:", port);
});