const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');

//Routes
const videoRouter = require('./Routes/video');
const authRouter = require('./Routes/auth');
const channelRouter = require('./Routes/channel');


require('dotenv').config();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

async function dbconnection() {
    await mongoose.connect("mongodb://localhost:27017/project");
}
dbconnection().then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log("Error in connecting to DB", err);
})


app.get('/', (req, res) => {
    res.send("Root Route");
});

app.use('/videos', videoRouter);
app.use('/auth', authRouter);
app.use('/channel', channelRouter);

app.listen(3500, () => {
    console.log("Server is listening on port 3500")
})