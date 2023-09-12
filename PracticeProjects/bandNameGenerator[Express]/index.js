import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));


app.post("/submit", (req,res)=>{
    console.log(req.body);
    const {street, pet} =req.body;
    res.send(`<h1>your band name is </h1> <h1> ${street}${pet} </h1>`);
})

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
})
app.listen(port, ()=>{
    console.log(`server running on: ${port}...`);
})