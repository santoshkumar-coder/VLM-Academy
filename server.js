import dotenv from 'dotenv'
import dbConnect from './config/db.js';
import userRoute from './route/userRoute.js';
import teacherRoute from './route/teacherProfileRoute.js'
import error from './middleware/error.js';
<<<<<<< HEAD
import teacherQualificationRoute from './route/teacherQualification.route.js';
import interviewRoutes from './route/interviewRoutes.js'

=======
import teacherQualificationRoute from './route/teacherQualification.route.js'
>>>>>>> fa811a417c8937155505e1daf23b32fce6432ac2

dotenv.config()
dbConnect();
import express from 'express'
const app = express();


<<<<<<< HEAD
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({  limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));


=======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
>>>>>>> fa811a417c8937155505e1daf23b32fce6432ac2

app.get('/test', (req, res)=>{
    console.log('backend is runing ...');
    res.send('backend is runing ...')
})

app.use('/api/user', userRoute);
app.use("/api/teacher", teacherRoute);
<<<<<<< HEAD
app.use("/api/interview", interviewRoutes );

=======
>>>>>>> fa811a417c8937155505e1daf23b32fce6432ac2
app.use("/api/teacher-qualification", teacherQualificationRoute);

app.use(error);







app.listen(process.env.PORT ,()=>{
    console.log(`server is runing on port ${process.env.PORT} ...`)
})