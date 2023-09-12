import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();


const date = new Date();
const day = date.getDay();  // 0-6 , 0:sunday


app.get("/", (req, res) => {
    if(day===6 || day===0){
        res.render( "index.ejs", {value:"the weekend", value2:"have fun"});
    }
    else
        res.render( "index.ejs", {value:"a weekday", value2:"do some work"});
})


const port =3000;
app.listen(port, function(){
    console.log("Server up and running ", port);
})