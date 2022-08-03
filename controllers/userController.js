const bcrypt = require('bcryptjs')
const user = require('../models/user')
const randomstring = require('randomstring')
var twilio = require('twilio')
var accountsid = 'your accountsid'
var authToken = 'your authToken'
var client = twilio (accountsid, authToken)



module.exports = {

    // =============rgistration get and post route============
    registerGet:(req, res)=>{
        res.render('default/register')
    },
    registerPost:async(req, res)=>{
       
        // ==========collecting the user information=================
        let {firstName,lastName,email,phoneNumber,password} = req.body
        let User = new user({ firstName, lastName, email, phoneNumber, password }) 



        const meesh = await user.findOne({'email':req.body.email})
        console.log(email)

        // ====checking for the existence of a mail=============
        if(meesh){
            req.flash('error', 'email already exist')
            res.redirect('/user/register')
            return
        }

        // ========if password did not match it should return error======
        if(req.body.password !== req.body.confirmPassword){
            req.flash('error', 'password mismatch')
            res.redirect('/user/register')
        }
// ===========checking if the password is same then it hashes it then then save the user============
        if(req.body.password ===req.body.confirmPassword){
            bcrypt.genSalt(10, (err,salt)=>{
                bcrypt.hash(User.password, salt,(err, hash)=>{
                    if(err) throw err
                    User.password = hash
                    User.save().then(()=>{
                        console.log('User savd successfully')
                    }).catch(err =>{
                        console.log(err)
                    })
                })
            })
        }
// ================function for the validitity of the phobeNumber===============
        function validPhoneNumber(phoneNumber){
            return /^\+?[1-9]\d{1,14}$/.test(phoneNumber)
        }

        // ==generating random string==================
        const secretNumber = randomstring.generate({length: 4, charset:'numeric'})
        console.log(secretNumber)



            const phoneNumbers = await user.findOne({'phoneNumber': req.body.phoneNumber})

            console.log(phoneNumber)
// =================checking if phone number is valid====================
        if (!validPhoneNumber(phoneNumber)){
                req.flash('error', 'invaild number')
            }

            // ===creating the content of the message===============
            const createText ={
                body:`hello ${req.body.firstName} enter this ${secretNumber} to verify your account`,
                from: +12182824252,
                to:phoneNumber
            }
            client.messages.create(createText).then(message =>{
                console.log(message.sid)
                req.flash('success', `verify your account by typing the token sent to ${req.body.phoneNumber} `)
                res.redirect('/user/verify')
            }).catch(err =>{
                console.log(err)
            })

    },

    verifyGet:(req, res)=>{
        res.render('default/verify')
    },
    verifyPost:async(req, res, next)=>{
        try {
            const { Token } = req.body;

            // Find acct with matching secret token in the database
            const user = await user.findOne({ Token: Token.trim() });

            // If the secretToken is invalid
            if (!user) {
                req.flash("error", "Your Token is not valid, Please Check your Token");
                res.redirect("/user/verify");
                return;
            }

            // If the secretToken is valid
            user.active = true;
            user.Token = "";
            await user.save();

            req.flash("success", "Account verification successfull! You may log in");
            res.redirect("/");
        }
        catch(err){
            next(err)
        }
    }

}
