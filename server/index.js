const express=require('express')
const router=require('./routes/router')
const cors=require('cors')
const {Authorization}=require('../server/middleware/authMiddleware')
const moongose=require('mongoose')
const app=express()


app.use(express.json());

app.use(cors())

moongose.connect('mongodb://127.0.0.1:27017/chat') // mongoDB connection
app.use('/api',Authorization,router)


app.listen(3001,()=>{
    console.log("server is runing")
})
