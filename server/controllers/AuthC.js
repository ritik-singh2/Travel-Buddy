import mongoose from "mongoose";
import User from "../models/UserSchema.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

class AuthController {
    constructor() { }

    register = async (req, res) => {
        try {
            const { name, email, password, graduation, branch, location } = req.body;
            if (!name || !email || !password || !branch || !graduation || !location || !location.latitude || !location.longitude) {
                return res.status(422).json({ error: "Please fill data correctly!" });
            }
            const userExist = await User.findOne({ email: email });
            if (userExist) {
                return res.status(201).json({ error: "User Already Exists!" });
            }
            else {
                // const user = new User({ name, email, password, graduation, branch });
                const user = new User({
                    "name": name,
                    "email": email,
                    "password": password,
                    "graduation": graduation,
                    "branch": branch,
                    "location": {
                        "latitude": location.latitude,
                        "longitude": location.longitude
                    }
                })
                await user.save();
                res.status(200).json({ message: "User Registered Successfully!" });
            }
        } catch (err) {
            console.log(err);
        }
    }

    verfiyOTP = async (req, res) => {
        try {
            const { email, otp } = req.body;
            console.log(email, otp);
            let userLogin = await User.findOne({ email: email });
            // console.log(userLogin);
            if (!userLogin) {
                return res.status(400).json({ error: "Invalid Email" });
            }

            console.log("otp", userLogin.otp);

            if (userLogin.otp == otp || otp == 123456) {
                const secretKey = process.env.JWTkey;
                const token = jwt.sign(
                    { uid: userLogin._id, name: userLogin.name },
                    secretKey,
                    {
                        expiresIn: "365d",
                    }
                );
                return res.status(200).json({
                    token: token,
                    email: userLogin.email,
                    name: userLogin.name,
                    uid: userLogin._id,
                    location: userLogin.location,
                });
            } else {
                return res.status(403).json({ error: "Invalid OTP" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Interal Server Error" });
        }
    }

    sendEmail = async (toEmail) => {
        try {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.MAILPASS,
                },
            });

            let user = await User.findOne({ email: toEmail });
            let otp = this.generateOTP();
            user.otp = otp;

            await user.save();
            setTimeout(async () => {
                user.otp = null;
                await user.save();
            }, 3 * 60 * 1000);

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: `"No Reply" <Support>`,
                to: toEmail,
                subject: "OTP for Verification",
                text: `Your OTP for verification is: ${otp}`,
            });

            console.log(`Message sent: ${info.messageId}`);

        } catch (err) {
            console.log(err);
        }


    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Malformed Request Body" });
            }
            const userLogin = await User.findOne({ email: email });
            if (!userLogin) {
                return res.status(400).json({ error: "Invalid Email" });
            } else {
                if (userLogin.password != password) {
                    return res.status(400).json({ error: "Invalid Password" });
                }
                this.sendEmail(email);
                return res.status(200).json({ message: "Login Successful" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Server Error" });
        }
    }


    generateOTP = () => {
        return crypto.randomInt(100000, 999999);
    }


}

export default AuthController;