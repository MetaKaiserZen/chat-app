const { Router } = require('express');

const filesystems = require('../config/filesystems');

const LoginController = require('../controllers/LoginController');
const RegisterController = require('../controllers/RegisterController');

const HomeController = require('../controllers/HomeController');
const DestinatarioController = require('../controllers/DestinatarioController');
const MensajeController = require('../controllers/MensajeController');
const FriendRequestController = require('../controllers/FriendRequestController');

const { status } = require('../middlewares/router');

const router = Router();

const upload = filesystems.upload();

router.post('/login', LoginController.login());
router.post('/register', RegisterController.register());

router.get('/usuarios/listar/:id', HomeController.listarUsuario());
router.get('/usuarios/destinatarios/listar/:id', HomeController.listarDestinatario());
router.get('/usuarios/friend-requests/listar/:id', HomeController.listarFriendRequest());
router.post('/usuarios/friend-requests/crear', HomeController.crearFriendRequest());

router.get('/destinatarios/listar/:id', DestinatarioController.listarDestinatario());

router.get('/mensajes/listar/:destinatario', MensajeController.listarDestinatario());
router.get('/mensajes/listar/:id/:destinatario', MensajeController.listarMensaje());
router.post('/mensajes/crear', upload.single('imagen'), MensajeController.crearMensaje());
router.post('/mensajes/eliminar', MensajeController.eliminarMensaje());

router.get('/friend-requests/listar/:id', FriendRequestController.listarFriendRequest());
router.post('/friend-requests/aceptar', FriendRequestController.aceptarFriendRequest());

status(router);

module.exports = router;
