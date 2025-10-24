import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI!)
    .then(() => console.log("connesso a MongoDB"))
    .catch((err) => console.error(err))