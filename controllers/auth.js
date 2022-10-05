const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)

exports.signup = async (req, res, next) => {
  const phone = req.body.phone;
  const password = req.body.password;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      password: hashedPw,
      phone: phone
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created Successfully!', user: result });
  } catch (err) {
    res.status(500).send(err.message)
  };
}

exports.login = async (req, res, next) => {
  const phone = req.body.phone;
  const password = req.body.password;
  try {
    const user = await User.findOne({ phone: phone });
    const isEqual = await bcrypt.compare(password, user.password);
  
    if (user && isEqual) {
      const result = await client
        .verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({
          to: `+${req.body.phone}`,
          channel: "sms"
        })
      res.status(200).json({
        data: "otp send successfully"
      })
    }
    else{
      res.status(500).json({message:"Incorrect Phone Number and Password"
    })
  }}
    
  catch (err) {
    res.status(500).send(err.message)
  }
};
exports.verify = async (req, res, next) => {
  const phone = req.body.phone
  const user = await User.findOne({ phone });
  // console.log(user)
  try {
    const data = await client
      .verify
      .services("VAbaa0c7746b63b20e8ebf47bab66023bc")
      .verificationChecks
      .create({
        to: `+${req.body.phone}`,
        code: req.body.code
      })
    // console.log(data)
    if (data.status == "approved") {
      const token = jwt.sign(
        {
          phone: user.phone,
          userId: user._id.toString()
        },
        process.env.JWTSECREAT,
        { expiresIn: '24h' }
      );
      res.status(200).send({ status: "User Verify Successfully!!!!", token: token, UserData: user })
    }
    else{res.status(500).send({ status: "User Not Verified!!!!" })}
    
  } catch (error) {
    res.status(500).send(error.message)
  }
}


