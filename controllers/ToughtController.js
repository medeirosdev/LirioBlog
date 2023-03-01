const Tought = require('../models/Tought')
const User = require('../models/User')

const {Op} = require('sequelize')

module.exports = class ToughtController {
    static async showToughts(req , res){

        let search = '' ;
        if(req.query.search){
            search = req.query.search
        }


        let order = 'DESC'

        if(req.query.order === 'old'){
            order='ASC'
        }else{
            order='DESC'
        }


        const toughtsData = await Tought.findAll(
            {
                include: User,
                where: {
                    title: {[Op.like]: `%${search}%`}
                },
                order: [['createdAt' , order]]
            }
        )

        const toughts = toughtsData.map((result) => result.get({plain : true}))

        let toughtsQty = toughts.length

        if( toughtsQty === 0){
            toughtsQty = false
        }
        
        res.render('toughts/home' , {toughts , search , toughtsQty});
    }


    static async dashboard(req , res){
        const userId = req.session.userid

        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Tought,
            plain: true, // filtro de dados para enviar apenas dados importantes
        })
        // Chegar se o user existe
        if(!user){
            res.redirect('/login')
        }

        const toughts = user.Toughts.map((result) =>
            result.dataValues
        )


        let emptyToughts = false

        if(toughts.length === 0){
            emptyToughts = true
        }


        res.render('toughts/dashboard' , { toughts , emptyToughts } )
    }


    static async createTought(req , res){
        res.render('toughts/create')

    }

    static async createToughtsave(req , res){
        const tought = {
            title: req.body.title ,
            UserId: req.session.userid
        }

        try {
            await Tought.create(tought)

        req.flash('message' , '´Pensamento Criado!');

        req.session.save(()=>{
            res.redirect('/toughts/dashboard')
        })
        }catch(err){
            console.log(err)
        }
    }

    static removeTought(req, res) {
        const id = req.body.id
    
        Tought.destroy({ where: { id: id } })
          .then(() => {
            req.flash('message', 'Pensamento removido com sucesso!')
            req.session.save(() => {
              res.redirect('/toughts/dashboard')
            })
          })
          .catch((err) => console.log(err))
      }

    static async updateTought(req  , res ){
        const id = req.params.id ;

        const tought = await Tought.findOne({where: {id:id} , raw: true})

        res.render('toughts/edit' , { tought })
    }

    static async updateToughtsave(req, res){
        const id = req.body.id
        const tought = {
            title: req.body.title
        }

        try{
            await Tought.update( tought , {where: {id : id}})
        req.flash('messa' , 'Pensamento Atualizado com Sucesso')

        req.session.save(()=>{
            res.redirect('/toughts/dashboard')
        })
        }catch(err){console.log(err)}

    }



    
}