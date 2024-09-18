const express = require('express');
const fs = require('fs');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const ejs = require('ejs');


//models
const Portfolio = require("./models/Portfolio");
const User = require("./models/User");


//connect db
mongoose.connect('mongodb://localhost/agency-db')

global.userIN = null;//global bir userın değişkeni tanımladık 



//middlewares
const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(methodOverride('_method'));
//session
app.use(session({
    secret: 'agency_pages',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/agency-db'}),
}));






//routes
app.use('*', (req, res, next) => {
    userIN = req.session.userID;
    next();
});

app.get('/', async (req, res) => {
    console.log(req.session.userID)
    const portfolios = await Portfolio.find({})
    res.render('index', {
        portfolios
    })
});
app.get('/register', async (req, res) => {
    res.status(200).render(
        'register'
    )
});

app.get('/login', async (req, res) => {
    res.status(200).render(
        'login'
    )
});

app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
})



app.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).redirect('/login')

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error

        }
        )
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if (same) {

                    //USer SESSİOnnn
                    req.session.userID = user._id
                    res.status(200).redirect('/');
                }

            })
        }
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error

        });
    }
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
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });

        if (!portfolio) {

            return res.status(404).send('portfolio not found');
        }

        portfolio.title = req.body.title,
            portfolio.brief = req.body.brief
        portfolio.client = req.body.client,
            portfolio.category = req.body.category,
            portfolio.description = req.body.description

        await portfolio.save();

        res.redirect('/');
    } catch (error) {
        res.status(500).send('server error')
    }

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

//put methodu yöntemiyle portfolio silmek
// app.delete('/portfolios/:id', async (req, res) => {
//     const portfolio = await Portfolio.findOne({ _id: req.params.id });
//     let deletedPhoto = __dirname + '/public' + portfolio.photo;
//     fs.unlinkSync(deletedPhoto);
//     await Portfolio.findByIdAndRemove(req.params.id);
//     res.redirect('/');
//   });

app.get('/portfolios/delete/:id', async (req, res) => {

    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id });


        if (!portfolio) {
            return res.status(404).send('portfolio not found');
        }

        let deletedPhoto = __dirname + '/public' + portfolio.photo;

        fs.unlinkSync(deletedPhoto)
        await Portfolio.findByIdAndDelete(req.params.id);
        res.status(200).redirect("/");

    } catch (error) {
        res.status(500).send('server error')
    }
});














const port = 3000;
app.listen(port, () => {
    console.log(`sunucu ${port} portunda başlatıldı.. `)
})