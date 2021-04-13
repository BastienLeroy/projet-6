const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/auth');


exports.signup = (req, res, next) => {
    console.log("req.body signup:", req.body);

    const password = req.body.password;

    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new user({
                email: req.body.email,
                password: hash
              });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => {
                    console.log(error);
                    res.status(400).json({ error })
                });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error });
                
            });
        };

exports.login = (req, res, next) => {
	user.findOne({user: req.body.user, email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
            
        });
    })};
