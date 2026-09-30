const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

async function catwayExists(n) {
  return Catway.exists({ catwayNumber: Number(n) });
}

async function hasOverlap(catwayNumber, startDate, endDate, excludeId = null) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

  const query = {
    catwayNumber: Number(catwayNumber),
    startDate: { $lt: end },
    endDate: { $gt: start }
  };
  if (excludeId) query._id = { $ne: excludeId };
  return Reservation.exists(query);
}

exports.list = async (req, res, next) => {
  try {
    if (!await catwayExists(req.params.id)) return res.status(404).json({ error: 'Catway introuvable.' });
    res.json(await Reservation.find({ catwayNumber: Number(req.params.id) }).sort('startDate'));
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.idReservation)) return res.status(400).json({ error: 'Identifiant de réservation invalide.' });
    const r = await Reservation.findOne({ _id: req.params.idReservation, catwayNumber: Number(req.params.id) });
    if (!r) return res.status(404).json({ error: 'Réservation introuvable.' });
    res.json(r);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const n = Number(req.params.id);
    if (!await catwayExists(n)) return res.status(404).json({ error: 'Catway introuvable.' });
    if (await hasOverlap(n, req.body.startDate, req.body.endDate)) {
      return res.status(409).json({ error: 'Ce catway est déjà réservé sur tout ou partie de cette période.' });
    }
    const r = await Reservation.create({
      catwayNumber: n,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });
    res.status(201).json(r);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const rid = req.body.idReservation || req.body._id;
    if (!rid || !mongoose.isValidObjectId(rid)) return res.status(400).json({ error: 'idReservation est obligatoire dans le corps de la requête.' });
    const r = await Reservation.findOne({ _id: rid, catwayNumber: Number(req.params.id) });
    if (!r) return res.status(404).json({ error: 'Réservation introuvable.' });

    const startDate = req.body.startDate !== undefined ? req.body.startDate : r.startDate;
    const endDate = req.body.endDate !== undefined ? req.body.endDate : r.endDate;
    if (await hasOverlap(r.catwayNumber, startDate, endDate, r._id)) {
      return res.status(409).json({ error: 'Ce catway est déjà réservé sur tout ou partie de cette période.' });
    }

    ['clientName', 'boatName', 'startDate', 'endDate'].forEach(k => {
      if (req.body[k] !== undefined) r[k] = req.body[k];
    });
    await r.save();
    res.json(r);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.idReservation)) return res.status(400).json({ error: 'Identifiant de réservation invalide.' });
    const r = await Reservation.findOneAndDelete({ _id: req.params.idReservation, catwayNumber: Number(req.params.id) });
    if (!r) return res.status(404).json({ error: 'Réservation introuvable.' });
    res.json({ message: 'Réservation supprimée.' });
  } catch (e) { next(e); }
};
