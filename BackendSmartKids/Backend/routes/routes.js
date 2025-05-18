const express = require("express")
const app = express();
const router = express.Router();
const UserController = require("../controllers/UserController");
const CadastroController = require("../controllers/CadastroController");
const HistoricoController = require("../controllers/HistoricoController");

router.post('/user', UserController.create);
router.get("/user",UserController.index);
router.get("/user/:idUsuario",UserController.findUser);
router.put("/user",UserController.edit);
router.delete("/user/:idUsuario",UserController.remove);
router.post("/login",UserController.login);

router.post('/cadastro', CadastroController.create);
router.get("/cadastro",CadastroController.index);
router.get("/cadastro/:idCadastro",CadastroController.findIdCadastro);
router.put("/cadastro",CadastroController.edit);
router.delete("/cadastro/:idCadastro",CadastroController.remove);

router.post('/historico', HistoricoController.create);
router.get("/historico",HistoricoController.index);
router.get("/historico/:idHistorico",HistoricoController.findHistorico);
router.put("/historico",HistoricoController.edit);
router.delete("/historico/:idHistorico",HistoricoController.remove);


module.exports = router;