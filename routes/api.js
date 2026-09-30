const router=require('express').Router(); const c=require('../controllers/catwayController'); const r=require('../controllers/reservationController'); const u=require('../controllers/userController'); const {requireAuth}=require('../middleware/auth');
router.use(requireAuth);
router.get('/catways',c.list); router.get('/catways/:id',c.get); router.post('/catways',c.create); router.put('/catways/:id',c.update); router.delete('/catways/:id',c.remove);
router.get('/catways/:id/reservations',r.list); router.get('/catways/:id/reservations/:idReservation',r.get); router.post('/catways/:id/reservations',r.create); router.put('/catways/:id/reservations',r.update); router.delete('/catways/:id/reservations/:idReservation',r.remove);
router.get('/users',u.list); router.get('/users/:email',u.get); router.post('/users',u.create); router.put('/users/:email',u.update); router.delete('/users/:email',u.remove);
module.exports=router;
