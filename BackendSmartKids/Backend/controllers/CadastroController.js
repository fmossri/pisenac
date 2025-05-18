var cadastro = require("../models/Cadastro");

class CadastroController{
    async create(req, res){
        var {idCadastro,nome,sobrenome,documento,endereco,cep} = req.body;
        
        if(IdCadastro == undefined){
            res.status(400);
            res.json({err: "O codigo é inválido!"})
            return;
        }

        var idCadastroExists = await User.findById(idCadastro);

        if(idCadastroExists){
            res.status(406);
            res.json({err: "O registro já está cadastrado!"})
            return;
        }

        
        await cadastro.new(idCadastro,nome,sobrenome,documento,endereco,cep);
        
        res.status(200);
        res.send("Tudo OK!");
    }


    async index(req, res){
        var cadastros = await cadastro.findAll();
        res.json(cadastros);
    }

    async findIdCadastro(req, res){
        var idCadastro = req.params.idCadastro;
        var cadastros = await cadastro.findById(idCadastro);
        if(cadastros == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200)
            res.json(cadastros);
        }
    }

    async edit(req, res){
        var {idUsuario, email, senha , tipoUsuario} = req.body;
        var result = await cadastro.update(idCadastro,nome,sobrenome,documento,endereco,cep);
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo OK!");
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
        var idCadastro = req.params.idCadastro;

        var result = await User.delete(idCadastro);

        if(result.status){
            res.status(200);
            res.send("Tudo OK!");
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    
}

module.exports = new CadastroController();