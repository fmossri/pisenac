const Historico = require("../models/Historico");
const User = require("../models/User");
const Cadastro = require("../models/Cadastro");


class HistoricoController{
    async create(req, res){
        var {Paciente,Profissional,dtConfirmacao,dtAtendimento,historico} = req.body;
        
        await Historico.new(Paciente,Profissional,dtConfirmacao,dtAtendimento,historico);
        
        res.status(200);
        res.send("Tudo OK!");
    }


    async index(req, res){
        var historicos = await Historico.findAll();
        res.json(historicos);
    }

    async findHistorico(req, res){
        var idHistorico = req.params.idHistorico;
        var historicos = await Historico.findById(idHistorico);
        if(historicos == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200)
            res.json(historicos);
        }
    }

    async findByUsuario(req, res) {
        const idUsuario = req.params.idUsuario;

        const user = await User.findById(idUsuario);
        if(!user){
            res.status(404);
            res.json({err: "Usuário não encontrado!"});
            return;
        }
        let historicos;
        if (user.tipoUsuario == 1){
            historicos = await Historico.findByPaciente(idUsuario);
            // Fetch profissional details for each historico
            for (let historico of historicos) {
                const profissional = await Cadastro.findByUsuario(historico.Profissional);
                if (profissional) {
                    historico.profissional = {
                        nome: profissional.nome,
                        sobrenome: profissional.sobreNome 
                    };
                }
            }

        }else if (user.tipoUsuario == 2){
            historicos = await Historico.findByProfissional(idUsuario);
            // Fetch paciente details for each historico
            for (let historico of historicos) {
                const paciente = await Cadastro.findByUsuario(historico.Paciente);
                if (paciente) {
                    historico.paciente = {
                        nome: paciente.nome,
                        sobrenome: paciente.sobreNome
                    };
                }
            }

        } else {
            return res.status(400).json({error: "Tipo de usuário inválido"});
        }


        res.json(historicos);
    }


    async edit(req, res){
        try{
            var {idHistorico,Paciente,Profissional,dtConfirmacao,dtAtendimento,historico} = req.body;

            var result = await Historico.update(idHistorico,Paciente,Profissional,dtConfirmacao,dtAtendimento,historico);
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
        }catch(err){
            res.status(500);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res){
        var idHistorico = req.params.idHistorico;

        var result = await Historico.delete(idHistorico);

        if(result.status){
            res.status(200);
            res.send("Tudo OK!");
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    
}

module.exports = new HistoricoController();

