const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
async function byNumber(n) { return Catway.findOne({ catwayNumber: Number(n) }); }
exports.list = async (req,res,next)=>{try{res.json(await Catway.find().sort('catwayNumber'));}catch(e){next(e)}};
exports.get = async (req,res,next)=>{try{const c=await byNumber(req.params.id); if(!c)return res.status(404).json({error:'Catway introuvable.'}); res.json(c);}catch(e){next(e)}};
exports.create = async (req,res,next)=>{try{const c=await Catway.create({catwayNumber:req.body.catwayNumber,catwayType:req.body.catwayType,catwayState:req.body.catwayState});res.status(201).json(c);}catch(e){next(e)}};
exports.update = async (req,res,next)=>{try{const c=await byNumber(req.params.id);if(!c)return res.status(404).json({error:'Catway introuvable.'}); if(req.body.catwayNumber!==undefined||req.body.catwayType!==undefined)return res.status(400).json({error:'Le numéro et le type du catway ne sont pas modifiables.'}); c.catwayState=req.body.catwayState; await c.save();res.json(c);}catch(e){next(e)}};
exports.remove = async (req,res,next)=>{try{const c=await byNumber(req.params.id);if(!c)return res.status(404).json({error:'Catway introuvable.'}); const count=await Reservation.countDocuments({catwayNumber:c.catwayNumber});if(count)return res.status(409).json({error:'Impossible de supprimer un catway possédant des réservations.'});await c.deleteOne();res.json({message:'Catway supprimé.'});}catch(e){next(e)}};
