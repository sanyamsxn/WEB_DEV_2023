//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//DB WORK
//mongodb connection
mongoose.connect("mongodb+srv://sanyamsxn1998:sanyam%4098At@cluster0.1sluaif.mongodb.net/todoListDB", {useNewUrlParser:true});
//schema for items
const itemSchema = new mongoose.Schema({
  name : {type: 'String', required: [true, "no name specified"]}  
});
//model
const Item = mongoose.model("Item", itemSchema);   //the collection name Item will be plural in DB like items

const item1 = new Item({name:"Do react module"});
const item2 = new Item({name:"START BLOG WEBSITE "});
const item3 = new Item({name:"READ A BOOK"});

const defaultItems =  [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name : String,
  items: [itemSchema]
})
const List = mongoose.model("List", listSchema);





app.get("/", async function(req, res) {
  //inserting into database named todoListDB
  // so that on restarting the server it don't create repeated items.
  const items = await Item.find({});
  if(items.length===0){
    Item.insertMany(defaultItems);
    res.redirect("/");
  }else{
    res.render("list", {listTitle: "Today", newListItems: items});
  }
});

//dynamic route using express, we want to make different list for work purpose
// /home, /Home the browser takes both as different pages. so to solve this we will 
// use lodash to capitalize the first letter of incoming listname .
app.get("/:customListName",async function(req, res) {
  const listName = _.capitalize(req.params.customListName);
  await List.findOne({name:listName})
    .then((docs)=>{
      if(!docs){
        const list = new List({name:listName, items:defaultItems});
        list.save();
      }else{
        res.render("list", {listTitle: docs.name, newListItems: docs.items});
      }
    })
    .catch((err)=>{
      console.log(err.message);
    })
  
  
})

app.post("/", function(req, res){
  const item = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Item({name:item});
  
  if(listName==="Today"){
    newItem.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName})
      .then((docs)=>{
        if(docs){
          docs.items.push(newItem);
          docs.save();
          res.redirect("/"+listName);
        }
      })
  }
  
});


app.post("/delete", async function(req, res){
  const id = req.body.checkboxData;
  const listName = req.body.listName;

  if(listName==="Today"){
    await Item.findByIdAndRemove(id);
    res.redirect("/");
  }else{
    //delete from matching list document and inside that also we need to find the element from an array.
    //$pull is a mongoDb method, it says pull the value from items array and the item's _id is id from req body.
    // pull removes the instance of the given value.
    List.findOneAndUpdate({name:listName}, {$pull:{items:{_id:id}}})
      .then((docs)=>{
        res.redirect("/"+listName);
      })
      .catch((err)=>{
        console.log(err.message);
      })
  }
  
})


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
