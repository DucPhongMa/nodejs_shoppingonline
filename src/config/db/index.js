const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb://localhost:27017/Online_Shopping', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Successfully!!!!!')
    }
    catch(error){
        console.log('Failure')

    }
}

module.exports = { connect };