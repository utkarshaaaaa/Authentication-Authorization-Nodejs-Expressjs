const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
//schema for user db
const userschema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    

    pic:{
        type:String,
       
        default:"https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg",
        

    },
    

    
})

userschema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)

})
//checking hash passoword
userschema.methods.matchPassword=async function(enterpassword){
    return await bcrypt.compare(enterpassword,this.password)
}

const user=mongoose.model('users',userschema)

module.exports=user