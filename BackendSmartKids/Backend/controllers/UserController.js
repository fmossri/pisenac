var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var Cadastro = require("../models/Cadastro");

var secret = "adsuasgdhjasgdhjdgahjsg12hj3eg12hj3g12hj3g12hj3g123";

var bcrypt = require("bcrypt");


class UserController{
    async create(req, res){
        try {
            var {email,senha,tipoUsuario, nome, sobrenome, documento, endereco, cep, docProfSaude} = req.body;
            
            if(email == undefined){
                res.status(400);
                res.json({err: "O e-mail é inválido!"})
                return;
            }

            const documentoExists = await Cadastro.findByDocumento(documento);
            if(documentoExists){
                res.status(406);
                res.json({err: "O documento já está cadastrado!"})
                return;
            }

            var emailExists = await User.findEmail(email);

            if(emailExists){
                res.status(406);
                res.json({err: "O e-mail já está cadastrado!"})
                return;
            }

            await User.new(email,senha,tipoUsuario);
            var user = await User.findByEmail(email);

            await Cadastro.new(
            user.idUsuario,
            nome,
            sobrenome,
            documento,
            endereco,
            cep,
            docProfSaude
            );
            
            res.status(200);
            res.send({"message": "Usuário criado com sucesso!"});
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({error: "Erro interno do servidor"});
        }
    }
    

    async index(req, res){
        var users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res){
        var idUsuario = req.params.idUsuario;
        var user = await User.findById(idUsuario);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200)
            res.json(user);
        }
    }

    async findByTipo(req, res){
        var tipoUsuario = req.params.tipoUsuario;
        var users = await User.findByTipo(tipoUsuario);
        res.json(users);
    }

    async edit(req, res){
        var {idUsuario, email, senha , tipoUsuario} = req.body;
        var result = await User.update(idUsuario,email,senha,tipoUsuario);
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send({"message": "Usuário atualizado com sucesso!"});
            }else{
                res.status(406);
                res.send(result.err)
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res){
        var idUsuario = req.params.idUsuario;

        var result = await User.delete(idUsuario);

        if(result.status){
            res.status(200);
            res.send({"message": "Usuário removido com sucesso!"});
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    /*
    async recoverPassword(req, res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        if(result.status){
           res.status(200);
           res.send("" + result.token);
        }else{
            res.status(406)
            res.send(result.err);
        }
    }

    async changePassword(req, res){
        var token = req.body.token;
        var password = req.body.password;
        var isTokenValid = await PasswordToken.validate(token);
        if(isTokenValid.status){
            await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
        }else{
            res.status(406);
            res.send("Token inválido!");
        }
    }
    */
    async login(req, res){
        try {
            var {email, senha } = req.body;
            console.log('Login attempt for email:', email);

            var user = await User.findByEmail(email);
            console.log('User found:', user ? 'yes' : 'no');

            if(user != undefined){
                var resultado = await bcrypt.compare(senha, user.senha);

                if(resultado){
                    var token = jwt.sign({ email: user.email, role: user.role }, secret);
                    res.status(200);
                    res.json({
                        token: token,
                        user: {
                            idUsuario: user.idUsuario,
                            email: user.email,
                            tipoUsuario: user.tipoUsuario
                        }
                    });
                }else{
                    res.status(406);
                    res.send("Senha incorreta");
                }
            }else{
                res.json({status: false});
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({error: "Erro interno do servidor"})
        }
    }
}

module.exports = new UserController();