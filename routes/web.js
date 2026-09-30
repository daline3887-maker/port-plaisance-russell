const router=require('express').Router(); const Catway=require('../models/Catway'); const Reservation=require('../models/Reservation'); const User=require('../models/User'); const {requireAuth}=require('../middleware/auth');
router.get('/',(req,res)=>res.render('home',{title:'Port Russell',error:req.query.error||null,user:req.session.user||null}));
router.get('/dashboard',requireAuth,async(req,res,next)=>{try{const now=new Date();const reservations=await Reservation.find({startDate:{$lte:now},endDate:{$gte:now}}).sort('endDate');res.render('dashboard/index',{title:'Tableau de bord',user:req.session.user,reservations,today:now});}catch(e){next(e)}});
router.get('/dashboard/catways',requireAuth,async(req,res,next)=>{try{res.render('catways/index',{title:'Catways',user:req.session.user,catways:await Catway.find().sort('catwayNumber')});}catch(e){next(e)}});
router.get('/dashboard/reservations',requireAuth,async(req,res,next)=>{try{res.render('reservations/index',{title:'Réservations',user:req.session.user,reservations:await Reservation.find().sort('-startDate'),catways:await Catway.find().sort('catwayNumber')});}catch(e){next(e)}});
router.get('/dashboard/users',requireAuth,async(req,res,next)=>{try{res.render('users/index',{title:'Utilisateurs',user:req.session.user,users:await User.find().sort('username')});}catch(e){next(e)}});
router.get('/docs',(req,res)=>res.render('docs/index',{title:'Documentation API',user:req.session.user||null}));
module.exports=router;
