const User = require('../models/User')

const bcrypt = require('bcryptjs');

module.exports = class AuthController {

    static login(req , res) {
        res.render('auth/login')
    }

    static register(req , res) {
        res.render('auth/register')
    }

    static logout(req , res) {
        req.session.destroy();
        res.redirect('/login')
    }

    static async loginPost(req , res){
        const {email , password  } = req.body

        //Find user
        const user = await User.findOne({ where: { email : email}})

        if(!user){
            req.flash('message' , 'Usuário Não Encontrado!')
            res.render('auth/login')
            return
        }

        //Password Match

        const passwordMatch = bcrypt.compareSync(password , user.password );
        if(!passwordMatch){
            req.flash('message' , 'Senha Incorreta')
            res.render('auth/login')
            return

        }
            //Inicializar a Sessão do usuário
            req.session.userid = user.id

            req.flash('message' , 'Bem vindo(a)!');

            req.session.save(() => {
                res.redirect('/')
            })



    }



    static async registerPost(req , res) {
        const { name , email, password , confirmpassword } = req.body

        // Password Match Validation

        if(password != confirmpassword){
            //Flash message
            req.flash('message' , "As senhas não conferem, tente novamente!")
            res.render('auth/register')

            return
        }

        //check if user exists

        const checkIfUserExists = await User.findOne({where: {email : email}})

        if(checkIfUserExists){
            req.flash('message' , "O e-mail já está em Uso!");
            res.render('auth/register')

            return
        }

        //Create a password
        // Método para criptografar a senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password , salt)

        const user = {
            name,
            email,
            password : hashedPassword
        }
        try{
            const createdUser = await User.create(user)

            //Inicializar a Sessão do usuário
            req.session.userid = createdUser.id

            req.flash('message' , 'cadastro realizado com sucesso!');

            req.session.save(() => {
                res.redirect('/')
            })

        }catch(err){
            console.log(err)
        }

        
    }

}