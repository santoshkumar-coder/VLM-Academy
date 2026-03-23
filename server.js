import dotenv from 'dotenv'
import dbConnect from './config/db.js';
import userRoute from './route/userRoute.js';
import teacherRoute from './route/teacherProfileRoute.js'
import error from './middleware/error.js';

dotenv.config()
dbConnect();
import express from 'express'
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get('/test', (req, res)=>{
    console.log('backend is runing ...');
    res.send('backend is runing ...')
})

app.use('/api/user', userRoute);
app.use("/api/teacher", teacherRoute);

app.use("/api/teacher-qualification", teacherQualificationRoute);

app.use(error);







app.listen(process.env.PORT ,()=>{
    console.log(`server is runing on port ${process.env.PORT} ...`)
})