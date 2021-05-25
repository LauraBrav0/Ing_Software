const {Router}=require ('express');
const router=Router();

//incluyendo al index.controller.js
const control=require('../controllers/index.controller')

//navegaciones
router.get('/', control.renderIndex);

router.get('/graficas', control.renderGrafica);

router.get('/ventas', control.renderVentas);

router.get('/reportes', control.renderReportes);

//peticiones
router.post('/altaVentas', control.altaVentas);

router.post('/editarDatos/', control.editarDatos);

module.exports=router;