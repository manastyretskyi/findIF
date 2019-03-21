const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

signToken = async user => {
    const token = await jwt.sign(
        {
        username: user.username,
        id: user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h',
        }
    );

    return token;
};

module.exports.login = async (req, res, next) => {
    try {
        const token = await signToken(req.user);
        return res.status(200).json({
            token: token
        });
    } catch(err) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};

module.exports.registration = async (req, res, next) => {

    try {

        const exist = await User.find({'local.email': req.body.email });

        if(exist.length >= 1){
            return res.status(409).json({
                message: "Mail exists"
            });
        }

        const user = await  new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            local: {
                email: req.body.email,
                password: req.body.password,
            },
            phone: req.body.phone,
            fb: req.body.fb,
            instagram: req.body.instagram,
            created: new Date()
        });
        user.strategy = 'local';
        await user.save()

        const token = await signToken(user);

        return res.status(200).json({
            message: 'Regitred user',
            user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    surname: user.surname,
                    email: user.local.email,
                    phone: user.phone,
                    fb: user.fb,
                    instagram: user.instagram,
                    url: 'http://localhost:3030/user/' + user.id,
                },
            token: token
        });

    } catch(err) {
        res.status(500).json({
            error: err
        });
    };
};

module.exports.googleOauth = async (req, res, next) => {    
    try {
        const token = await signToken(req.user);
        return res.status(200).json({
            token: token
        });
    } catch(err) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};

module.exports.facebookOauth = async (req, res, next) => {
    try {
        const token = await signToken(req.user);
        return res.status(200).json({
            token: token
        });
    } catch(err) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};