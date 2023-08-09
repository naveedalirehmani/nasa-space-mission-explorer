const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URL;

mongoose.connection.once('open', () => {
    console.log('\x1b[32m', 'CONNECTED TO MONGODB');
});

mongoose.connection.on('error', (error) => {
    console.error(error);
});

async function mongoConnect() {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        // useFindAndModify:false,
        // useCreateIndex:true, 
        useUnifiedTopology: true
    });
}

async function mongoDisconnect() {
    try{
        await mongoose.connection.close();
    }catch(error){
        console.log(error,'error');
    }
}

module.exports = { mongoConnect, mongoDisconnect };