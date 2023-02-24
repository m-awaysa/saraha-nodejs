var jwt = require('jsonwebtoken');
const { userModel } = require('../../../DB/model/user.model');
let bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const { sendEmail } = require('../../../services/email');


const signup = async (req, res) => {
    try {
        const { name, email, password, cPassword } = req.body;
        if (cPassword == password) {
            const user = await userModel.findOne({ email });
            if (!user) {
                let hashPassword = await bcrypt.hash(password, parseInt(process.env.SaltRound));
                const newUser = new userModel({ email, userName: name, password: hashPassword });
                const savedUser = await newUser.save();
                if (!savedUser) {
                    res.status(200).json({ message: "fail to signup" });
                } else {
                    let token = await jwt.sign({ id: savedUser._id }, process.env.CONFIRMEMAILTOKEN, { expiresIn: 1 });
                    let refreshToken = await jwt.sign({ id: savedUser._id }, process.env.REFRESHTOKENEMAIL);

                    let message = `
                <a href="${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}">verify email <a>`
                    let messageRefresh = `
                <a href="${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshToken/${refreshToken}">Resend Verify Email <a>`
                    await sendEmail(email, 'Confirm Email', `${message} <br/> ${messageRefresh}`);
                    res.status(201).json({ message: "success" });
                }
            } else {
                res.status(409).json({ message: 'email already exist' });
            }
        } else {
            res.status(400).status().json({ message: 'password not match' });
        }
    } catch (error) {
        res.status(400).json({ message: 'catch error', error })
    }
}

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.CONFIRMEMAILTOKEN);
        if (!decoded) {
            res.json({ message: 'invalid token payload' });
        } else {

            let user = await userModel.findByIdAndUpdate(
                { _id: decoded.id },
                { confirmEmail: true }
            );
            res.json({ message: 'your email is confirmed' });
        }

    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

const refreshToken = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.REFRESHTOKENEMAIL);

        if (!decoded) {
            res.json({ message: 'invalid token payload' });
        } else {
            const user = await userModel.findById(decoded.id).select('email');
            if (!user) {
                res.status(400).json({ message: 'not registered account' });
            } else {

                let token = await jwt.sign({ id: user._id }, process.env.CONFIRMEMAILTOKEN, { expiresIn: 60 * 5 });

                let message = `
            <a href="${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}">verify email <a>`

                await sendEmail(user.email, 'Confirm Email', message);

                res.status(201).json({ message: "success" });
            }
        }

    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                if (user.confirmEmail) {
                    const token = jwt.sign({ id: user._id }, process.env.LOGINTOKEN, { expiresIn: 60 * 60 * 24 });
                    res.json({ message: "success", token });
                } else {
                    res.json({ message: "please verify your email" });
                }
            } else {
                res.json({ message: "invalid account" });
            }

        } else {
            res.json({ message: "invalid account" });
        }

    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}

const sendCode = async (req, res) => {
    try {

        const { email } = req.body;
        const user = await userModel.findOne({ email: email }).select('email');
        if (user) {

            const code = nanoid();
            await sendEmail(email, 'Forget Password', `Verify Code : ${code}`);
            updateUser = await userModel.updateOne({ _id: user._id }, { sendCode: code });
            if (updateUser) {
                res.json({ message: "send data" });
            } else {
                res.json({ message: "invalid" });
            }


        } else {
            res.json({ message: "invalid account" });
        }

    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { code, email, newPassword } = req.body;
        if (code) {
            const hash = await bcrypt.hash(newPassword, parseInt(process.env.SaltRound));
            const user = await userModel.findOneAndUpdate({ email: email, sendCode: code }, { password: hash, sendCode: null });
            if (user) {
                res.json({ message: "success" });
            } else {
                res.json({ message: "invalid" });
            }
        } else {
            res.json({ message: "fail" });
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}


module.exports = { signup, confirmEmail, signin, sendCode, forgetPassword, refreshToken };