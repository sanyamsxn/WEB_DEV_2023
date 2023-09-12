import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "sanyamsxn";
const yourPassword = "password";
const yourAPIKey = "647f59cf-a072-411d-bdcd-deb0d5d05e2c";
const yourBearerToken = "fab5f434-e6c6-4b9b-b7ca-7b4d93151dd7";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth",async (req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  try{
    const result =  await axios.get(API_URL + "/random");
    res.render("index.ejs", {content:JSON.stringify(result.data)});
  }  catch(error){
    res.status(404).send( error.message);
  }
});

app.get("/basicAuth", async (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  try{
    const result = await axios.get(API_URL+"/all?page=2", {
      auth:{
        username: yourUsername,
        password: yourPassword
      }
    });
    res.render("index.ejs", {content:JSON.stringify(result.data)});
  }catch(error){
    res.status(404).send( error.message);
  }
  
});

app.get("/apiKey", async (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  try{
    const result = await axios.get(API_URL+"/filter", {
      params:{
        score:5,
        apiKey: yourAPIKey,
      }
    });
    res.render("index.ejs", {content:JSON.stringify(result.data)});
  } catch(error){
    res.status(404).send(error.message);
  }
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
});

const config = {
  headers: {Authorization: `Bearer ${yourBearerToken}`}
}
app.get("/bearerToken", async (req, res) => {
  try{
    const result = await axios.get(API_URL+"/secrets/2", config);
    res.render("index.ejs", {content:JSON.stringify(result.data)});
  }catch(error){
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
