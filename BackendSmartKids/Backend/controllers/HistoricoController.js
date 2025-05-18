const Historico = require("../models/Historico");



class HistoricoController{
    async create(req, res){
        var {idHistorico,Paciente,Profissional,dtAgendamento,dtConfirmacao,dtAtendimento,historico} = req.body;
        
        if(idHistorico == undefined){
            res.status(400);
            res.json({err: "O codigo histórico  inválido!"})
            return;
        }

        var idHistoricoExists = await Historico.findById(idHistorico);

        if(idHistoricoExists){
            res.status(406);
            res.json({err: "O Histórico já está cadastrado!"})
            return;
        }

        
        await Historico.new(idHistorico,Paciente,Profissional,dtAgendamento,dtConfirmacao,dtAtendimento,historico);
        
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

    async edit(req, res){
        var {idHistorico,Paciente,Profissional,dtAgendamento,dtConfirmacao,dtAtendimento,historico} = req.body;
        var result = await Historico.update(idHistorico,Paciente,Profissional,dtAgendamento,dtConfirmacao,dtAtendimento,historico);
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

