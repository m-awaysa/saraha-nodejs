require('dotenv').config();
const express = require('express');
const { connectDb } = require('./DB/connection');
const app = express();
const port = 3000;
const indexRouter = require('./modules/index.router');
app.use(express.json());
connectDb();
const baseUrl=process.env.BASEURL;
app.use(`${baseUrl}/upload`,express.static('./upload'));
app.use(`${baseUrl}/auth`,indexRouter.authRouter);
app.use(`${baseUrl}/message`,indexRouter.messageRouter);
app.use(`${baseUrl}/user`,indexRouter.userRouter);
app.use('*', (req, res)=>{
    res.json({message:'error 404'});
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));



