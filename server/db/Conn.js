import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

const DB = process.env.MONGO;

function init() {
    console.log("DB", DB);
    mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log(`DB connected`);
    }).catch((err) => 
    console.log(`DB connection failed ${err}`));
}

export default init;