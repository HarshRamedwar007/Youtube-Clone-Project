const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
module.exports.signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await Users.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "email already registered"
            });
        }

        let salt = await bcrypt.genSalt(10)
        let encrypt = await bcrypt.hash(password, salt)
        let newUser = new Users({
            name,
            email,
            password: encrypt
        });

        await newUser.save();
        newUser.password = ''
        let token = jwt.sign({ email }, process.env.JWT_SECRET);
        return res.status(200).json({
            success: true,
            message: "Signup successfully",
            user: newUser,
            token

        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error in signup route"
        });
    }
}


module.exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "email not registered"
            });
        }
        let compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }
        user.password = ''
        let token = jwt.sign({ email }, process.env.JWT_SECRET);
        return res.status(200).json({
            success: true,
            message: "Logedin successfully",
            user,
            token
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "error in login route"
        });
    }

}

module.exports.getuserController = async (req, res) => {
    try {
        // Example logic (replace with your actual implementation)
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(400).json({
                success: false,
                message: "Token expired",
            })
        }

        const user = await Users.findOne({ email: decode.email }).populate({ path: 'channel' });
        user.password = '' //Not sending password

        // Perform operations, e.g., find user by decoded info
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
}