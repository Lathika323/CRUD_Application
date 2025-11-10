//Load packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")

//Create Express App
const app = express();
app.use(express.json());
app.use(cors());

//Connect to Database
mongoose.connect("mongodb://127.0.0.1:27017/BIT")
.then(() => console.log("BIT MongoDB Connected!"))
.catch(err => console.log("Connection Error: ",err))

//Create Model & Schema
const Person = mongoose.model("Person", new mongoose.Schema({name:String, age:Number, email:String, department:String, phone:String, address:String, year:Number}), "students");

//READ Route
app.get("/", async(_req,res) => {
    try{
        const a =await Person.find().sort({name:1});
        res.json(a);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }
});

//CREATE Route
app.post("/", async(_req,res) => {
    try{
        const b = await Person.create(
            {
                name:_req.body.name,
                age:Number(_req.body.age),
                email:_req.body.email,
                department:_req.body.department,
                phone:Number(_req.body.phone),
                address:_req.body.address,
                year:Number(_req.body.year)
            });
            res.status(201).json(b);
    }
    catch(e){
        res.status(400).json({error: e.message});
    }
})

//UPDATE (or) Edit Route
app.put("/:_id",async(_req,res) => {
    try{
        const updated = await Person.findByIdAndUpdate(
            _req.params._id,
            {
                name:_req.body.name,
                age: Number(_req.body.age),
                email:_req.body.email,
                department:_req.body.department,
                phone:Number(_req.body.phone),
                address:_req.body.address,
                year:Number(_req.body.year)
            },
            {new : true}       //It returns the new updated value
        );
        if(!updated)  //If there is no update in name & age
            return res.status(400).json({error : "Not Found!"});
        res.json(updated);
    }
    catch(e){
        res.status(400).json({error: e.message});
    }
})

//DELETE Route
app.delete("/:_id", async(_req,res) => {
    try{
        const deleted = await Person.findByIdAndDelete(_req.params._id);
        if(!deleted)
            return res.status(404).json({error:"Not Found!"});
        res.json({ok:true});
    }
    catch(e){
         res.status(400).json({error: e.message});
    }
})
//Start the Server
app.listen(4000, () => console.log("Express API Server is running in http://localhost:4000"))

