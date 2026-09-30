const router = require('express').Router();
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
router.use(requireAuth);

async function hasOverlap(catwayNumber, startDate, endDate, excludeId = null) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
  const query = { catwayNumber: Number(catwayNumber), startDate: { $lt: end }, endDate: { $gt: start } };
  if (excludeId) query._id = { $ne: excludeId };
  return Reservation.exists(query);
}

router.post('/catways', async (req,res,next) => { try { await Catway.create(req.body); res.redirect('/dashboard/catways'); } catch(e) { next(e); } });
router.put('/catways/:number', async (req,res,next) => { try { const c=await Catway.findOne({catwayNumber:Number(req.params.number)}); if(!c){const e=new Error('Catway introuvable.');e.status=404;throw e;} c.catwayState=req.body.catwayState; await c.save(); res.redirect('/dashboard/catways'); } catch(e){next(e);} });
router.delete('/catways/:number', async (req,res,next) => { try { const n=Number(req.params.number); const c=await Catway.findOne({catwayNumber:n}); if(!c){const e=new Error('Catway introuvable.');e.status=404;throw e;} if(await Reservation.exists({catwayNumber:n})){const e=new Error('Impossible de supprimer un catway possédant des réservations.');e.status=409;throw e;} await c.deleteOne(); res.redirect('/dashboard/catways'); } catch(e){next(e);} });

router.post('/reservations', async (req,res,next) => { try { const n=Number(req.body.catwayNumber); if(!await Catway.exists({catwayNumber:n})){const e=new Error('Catway introuvable.');e.status=404;throw e;} if(await hasOverlap(n,req.body.startDate,req.body.endDate)){const e=new Error('Ce catway est déjà réservé sur tout ou partie de cette période.');e.status=409;throw e;} await Reservation.create(req.body); res.redirect('/dashboard/reservations'); } catch(e){next(e);} });
router.put('/reservations/:id', async (req,res,next) => { try { const r=await Reservation.findById(req.params.id); if(!r){const e=new Error('Réservation introuvable.');e.status=404;throw e;} const start=req.body.startDate!==undefined?req.body.startDate:r.startDate; const end=req.body.endDate!==undefined?req.body.endDate:r.endDate; if(await hasOverlap(r.catwayNumber,start,end,r._id)){const e=new Error('Ce catway est déjà réservé sur tout ou partie de cette période.');e.status=409;throw e;} ['clientName','boatName','startDate','endDate'].forEach(k=>{if(req.body[k]!==undefined)r[k]=req.body[k];}); await r.save(); res.redirect('/dashboard/reservations'); } catch(e){next(e);} });
router.delete('/reservations/:id', async (req,res,next) => { try { const r=await Reservation.findByIdAndDelete(req.params.id); if(!r){const e=new Error('Réservation introuvable.');e.status=404;throw e;} res.redirect('/dashboard/reservations'); } catch(e){next(e);} });

router.post('/users', async (req,res,next) => { try { await User.create(req.body); res.redirect('/dashboard/users'); } catch(e){next(e);} });
router.put('/users/:email', async (req,res,next) => { try { const u=await User.findOne({email:req.params.email.toLowerCase()}).select('+password'); if(!u){const e=new Error('Utilisateur introuvable.');e.status=404;throw e;} u.username=req.body.username; if(req.body.email)u.email=req.body.email; if(req.body.password)u.password=req.body.password; await u.save(); if(u._id.toString()===req.session.user.id){req.session.user.username=u.username;req.session.user.email=u.email;} res.redirect('/dashboard/users'); } catch(e){next(e);} });
router.delete('/users/:email', async (req,res,next) => { try { const u=await User.findOne({email:req.params.email.toLowerCase()}); if(!u){const e=new Error('Utilisateur introuvable.');e.status=404;throw e;} if(u._id.toString()===req.session.user.id){const e=new Error('Vous ne pouvez pas supprimer votre propre compte connecté.');e.status=400;throw e;} await u.deleteOne(); res.redirect('/dashboard/users'); } catch(e){next(e);} });
module.exports = router;
