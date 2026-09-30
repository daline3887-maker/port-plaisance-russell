function errorHandler(err, req, res, next) {
  console.error(err);
  let status = err.status || 500;
  let message = err.message || 'Erreur interne du serveur.';
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map(e => e.message).join(' '); }
  if (err.code === 11000) { status = 409; message = `Valeur déjà utilisée : ${Object.keys(err.keyPattern || {}).join(', ')}.`; }
  if (err.name === 'CastError') { status = 400; message = 'Identifiant invalide.'; }
  if (req.accepts(['html','json']) === 'json') return res.status(status).json({ error: message });
  res.status(status).render('error', { title: 'Erreur', status, message, user: req.session?.user });
}
module.exports = errorHandler;
