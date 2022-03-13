const mongoose = require('mongoose');
//const colors = require('colors');

const connectDB = async() => {

    const conn = await mongoose.connect(process.env.MONGO_URI
        // {
        //     useNewUrlParser:true,
        //     useCreateIndex:true,
        //     useFindAndModify:false,
        //     useUnifiedTopology:true
        // }
    );

        //console.log(`MongoDB Connected : ${conn.connection.host}`.cyan.bold);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
}

module.exports = connectDB;

//we use module.exports to exports the codes and to use another file by importing this file