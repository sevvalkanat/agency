const mongoose = require('mongoose');
const Schema = mongoose.Schema


    

const PortfolioSchema =  new Schema({
    title:{
        type:String,
        require: true,
        trim: true,
    },
    brief:{
        type:String,
        trim: true,
    },
    description:{
        type:String,
        require: true,
        trim: true,
    },
    client:{
        type:String,
        trim: true,
    },
    category:{
        type:String,
        trim: true,
    },
    photo:{
        type:String,
        trim: true,
        dateCreated: {
        type: Date,
        default:Date.now

    }
    }
    
})    




const Portfolio = mongoose.model('Portfolio',PortfolioSchema);

module.exports = Portfolio;
