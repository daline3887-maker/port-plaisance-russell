const User = require('../models/User');
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).render('home', { title:'Accueil', error:'E-mail et mot de passe obligatoires.', user:null });
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).render('home', { title:'Accueil', error:'Identifiants incorrects.', user:null });
    req.session.user = { id: user._id.toString(), username: user.username, email: user.email };
    req.session.save(() => res.redirect('/dashboard'));
  } catch (e) { next(e); }
};
exports.logout = (req, res, next) => req.session.destroy(err => err ? next(err) : res.redirect('/'));
