const express = require('express');
const fs = require('fs');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const ejs = require('ejs');



//models
const Portfolio = require("./models/Portfolio");


//connect db
mongoose.connect('mongodb://localhost/agency-db')





//middlewares
const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(methodOverride('_method'));





//routes
app.get('/', async (req, res) => {
    const portfolios = await Portfolio.find({})
    res.render('index', {
        portfolios
    })
});


app.get('/portfolios/:id', async (req, res) => {
    const portfolio = await Portfolio.findById(req.params.id)
    res.render('portfolio', {
        portfolio
    })

});

app.get('/portfolios/edit/:id', async (req, res) => {
    const portfolio = await Portfolio.findOne({ _id: req.params.id });
    res.render('edit', {
        portfolio
    })

});

app.put('/portfolios/:id', async (req, res) => {
    const portfolio = await Portfolio.findOne({ _id: req.params.id });
    portfolio.title = req.body.title,
    portfolio.brief = req.body.brief
    portfolio.client = req.body.client,
    portfolio.category = req.body.category,
    portfolio.description = req.body.description
    portfolio.save()

    res.redirect('/')
});

app.post('/portfolios', async (req, res) => {


    const uploadDir = 'public/uploads';

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    let uploadePhoto = req.files.photo;
    let uploadPath = __dirname + '/public/uploads/' + uploadePhoto.name;

    uploadePhoto.mv(uploadPath, async () => {
        await Portfolio.create({
            ...req.body,
            photo: '/uploads/' + uploadePhoto.name,
        });
        res.redirect('/');
    });
});















const port = 3000;
app.listen(port, () => {
    console.log(`sunucu ${port} portunda başlatıldı.. `)
})