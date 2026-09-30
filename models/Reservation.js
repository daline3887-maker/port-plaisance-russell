const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true, min: 1, index: true },
  clientName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  boatName: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true });
reservationSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) this.invalidate('endDate', 'La date de fin doit être postérieure à la date de début.');
  next();
});
module.exports = mongoose.model('Reservation', reservationSchema);
