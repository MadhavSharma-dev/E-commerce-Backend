// const jwt = require("jsonwebtoken");
// const generateToken = (id) =>{
//     return jwt.sign({id},process.env.JWT_SECRET,{
//         expiresIn : "1d"
//     });
// };
// module.exports = generateToken;


// One thing to note — your current generateToken only takes id. For role-based access control (admin vs seller vs customer, which your User model has), you'll want to include role in the payload too:


const jwt = require("jsonwebtoken");
const generateToken = (id,role)  => {
    return jwt.sign({id,role},process.env.JWT_SECRET,{
        expiresIn : "1d"
    });
};