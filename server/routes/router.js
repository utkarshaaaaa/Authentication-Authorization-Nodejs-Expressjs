const express=require('express')
const user = require('../model/schema')
const jwt=require('jsonwebtoken') 
const bcrypt=require('bcryptjs')
const SECRET_KET="HELLO"
const asynchandler=require('express-async-handler')
const router=express.Router()



//register user
router.route('/register').post(asynchandler(async(req,res)=>{
    const{name,email,password,pic}=req.body

    if(!name || !email || !password){
        res.status(400).json({"message":"Fill all the details"})
        throw new Error("Fill all the details")
    }
    const userexist= await user.findOne({email:email})
    if(userexist){
        res.status(400).json({message:"User already exist"})
        throw new Error("User already exist")
        

    }
  
    const actualuser= await user.create({
        name,
        email,
        password,
        pic,
        
        
    })
    const tokenreg= jwt.sign({email:actualuser.email,id:actualuser._id},SECRET_KET,{expiresIn:"15d"})
    if(actualuser){
       res.status(200).json({
            name:actualuser.name,
            email:actualuser.email,
            password:actualuser.password,
           
            pic:actualuser.pic,
            token:tokenreg
            
           
     })
   
       
    
        res.status(201).json({user:actualuser,token:tokenreg})
         

    }
    

}))

//login user

router.route('/login').post(asynchandler(async(req,res)=>{
    const{email,password}=req.body
    const userindb=await user.findOne({email:email })
    if(!userindb){
        return res.status(404).json({message:"User not found"})
    }
    const matchpassword=  await bcrypt.compare(password,userindb.password)

    if(!matchpassword){
        return res.status(400).json({message:"invalid_password"})
    }

    else{
        const token= jwt.sign({email:userindb.email,id:userindb._id},SECRET_KET)

        res.status(201).json({
            name:userindb.name,
            email:userindb.email,
            
          
           pic:userindb.pic,
           token:token
           

            

        })
       
       
        //res.cookie("jwt",token,{
            //expires:new Date(Date.now() + 5000000000),
            //httpOnly:true
        //})      

    }


   
}))

//find a perticular user in search 

router.route('/user/:search').get( async(req,res)=>{
    const userparams=req.params.search ? {
        $or:[
            {name: {$regex : req.params.search , $options : "i"}},
            {email: {$regex : req.params.search , $options : "i"}},
        ]
    }
  :{}

  const users=await user.find(userparams).find({_id:{$ne:req.user._id}})
  res.send(users)

})


module.exports = router;