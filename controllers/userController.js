const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    console.log(req.body);
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: passwordHash,
    });
    await user.save();
    res.json({
      message: "Registered successfully",
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        isonline: user.isonline,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

const login = async (req, res,next) => {
  try {
    if(req.body.email!="" && req.body.password!=''){

      // fetching data from database
    const user = await User.findOne({ email: req.body.email });
   
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
  

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    } else {
      const payload ={
        userid: user._id,
        email:user.email
      }

      const jwt_seceret = process.env.JWT_SECRET || 'THIS_JWT_SECRET';
      jwt.sign(payload,jwt_seceret,{expiresIn:84600},async (err,token)=>{
        await User.updateOne({_id:user._id},{
          $set:{token}
      })

      user.save();
      return res.status(200).json({
        user:{email:user.email,name:user.name,id:user._id},
        token:{token:token},
        message:"login sucess"
      });
    
      });
      
    }
   
  }
  else{
    res.status(400).json({
      message:"please enter the valid email and password",
      success:false,
    })
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
};

const logout = async (req, res) => {
  const userId = req.params.userId;
  if(!userId){
    return res.json({
      message:"id is not valid"
    })
  }
  else{
  await User.updateOne({ _id: userId }, { $set: { token: "" } });
  return res.json({
    message:"log out sucessfully"
  })
}

};

const loadUser = async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.session.user._id } });

    if (allUsers.length > 0) {
      res.json({
        users: allUsers,
        message: "Users have been populated",
      });
    } else {
      res.json({
        users: [],
        message: "No other users found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while loading users" });
  }
};







module.exports = {
  register,
  login,
  logout,
  loadUser,
 
};
