const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');



//models
const Portfolio =require("./models/Portfolio");


//connect db
mongoose.connect('mongodb://localhost/agency-db')



  

//middlewares
const app = express();
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));





//routes
app.get('/',async(req,res)=>{
    const portfolios = await Portfolio.find({})
    res.render('index',{
        portfolios
    })
}) 
app.get('/portfolios/:id',(req,res)=>{
console.log(req.params.id);
})

app.post('/portfolios',async(req,res)=>{
await Portfolio.create(req.body);
res.redirect('/');
})
















const port = 3000;
app.listen(port,()=>{
console.log(`sunucu ${port} portunda başlatıldı.. `)
})