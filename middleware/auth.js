function wantsJSON(req) { return req.path.startsWith('/api/') || req.accepts(['html','json']) === 'json'; }
function requireAuth(req, res, next) {
  if (req.session?.user) return next();
  if (wantsJSON(req)) return res.status(401).json({ error: 'Authentification requise.' });
  return res.redirect('/?error=Veuillez vous connecter');
}
module.exports = { requireAuth };
