//Config Módulos
const express = require('express')
const exphbs = require("express-handlebars")
const session = require('express-session')
const fileStore = require('session-file-store')(session)
const flash = require('express-flash')
const path = require('path')

//Criando Instância App do express
    const app = express()

//Conectando ao banco de dados
    const conn = require('./db/conn')

//Import Routes
    const toughtsRoutes = require('./routes/toughtsRoutes')

    const authRoutes = require('./routes/authRoutes')

//Import Controllers
    const ToughtController = require('./controllers/ToughtController')

// Models -> sync() irá automaticamente conectar e criar essas tabelas na database
    const Tought = require('./models/Tought')
    const User = require("./models/User")


//Handlebars
    app.set('view engine' , 'handlebars')
    app.set('views', path.join(__dirname, 'views'));
    app.engine('handlebars' , exphbs.engine({
        extname:'handlebars' ,
        defaultLayout : 'main' ,
        layoutsDir:  path.join(__dirname + '/views/layouts'), 
}))

// Config a pasta Public
    app.use(express.static(__dirname + '/public'));

//Receber Respostas do Body
    app.use(
        express.urlencoded({
            extended:true
        })
    )

    app.use(express.json())

//Session Middleware - Diz onde o handlebars vai salvar as sessões
app.use(
    session({
        name: "session" , 
        secret: "nosso_secret" ,
        resave: false,
        saveUninitialized : false,
        store : new fileStore({
            logFn : function() {} ,
            path: path.join(require('os').tmpdir() , 'sessions'),
        }),
        cookie : {
            secure: false,
            maxAge: 360000 ,
            expires: new Date(Date.now() + 360000) ,
            httpOnly: true
        }
    })
)


// Flash Messages
    app.use(flash())


// set session to res
    app.use((req, res , next)=> {
        if(req.session.userid) {
        res.locals.session = req.session
        }

    next()
})

//Routes
    app.use('/toughts' , toughtsRoutes)
    
    app.use('/' , authRoutes)

    app.get('/' , ToughtController.showToughts)


//Conexão Sync

    conn.sync()
        .then( ()=> {
            app.listen(3000)
        })
        .catch((err)=> {console.log(err)})

    //.sync({ force: true})
