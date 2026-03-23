import dotenv from 'dotenv'
import dbConnect from './config/db.js';
import userRoute from './route/userRoute.js';
import teacherRoute from './route/teacherProfileRoute.js'
import error from './middleware/error.js';
import teacherQualificationRoute from './route/teacherQualification.route.js';
import interviewRoutes from './route/interviewRoutes.js'


dotenv.config()
dbConnect();
import express from 'express'
const app = express();


app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({  limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));



app.get('/test', (req, res)=>{
    console.log('backend is runing ...');
    res.send('backend is runing ...')
})

app.use('/api/user', userRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/interview", interviewRoutes );

app.use("/api/teacher-qualification", teacherQualificationRoute);

app.use(error);







app.listen(process.env.PORT ,()=>{
    console.log(`server is runing on port ${process.env.PORT} ...`)
})