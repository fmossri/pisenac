var knex = require("../database/connection");

class Historico{
    async findAll(){
        try{
            var result = await knex.select(["idHistorico","Paciente","Profissional","dtAgendamento","dtConfirmacao","dtAtendimento","historico"]).table("historicos");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

    async findById(idHistorico){
        try{
            var result = await knex.select(["idHistorico","Paciente","Profissional","dtAgendamento","dtConfirmacao","dtAtendimento","historico"]).where({idHistorico:idHistorico}).table("historicos");
            
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }

        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async new(idHistorico,Paciente,Profissional,dtAgendamento,dtConfirmacao,dtAtendimento,historico){
        try{
            
            await knex.insert({idHistorico,Paciente,Profissional,dtAgendamento,dtConfirmacao,dtAtendimento,historico}).table("historicos");
        }catch(err){
            console.log(err);
        }
    }   
    async update(idHistorico,Paciente,Profissional,dtAgendamento,dtConfirmacao,dtAtendimento,historico){

        var historico = await this.findById(idHistorico);

        if(historico != undefined){

            var editHitorico = {};

            if(idCadastro != undefined){ 
                if(idHistorico != historico.idHistorico){
                   var result = await this.findById(idHistorico);
                   if(result == false){
                        editHistorico.idHistorico = idHistorico;
                   }else{
                        return {status: false,err: "Já está cadastrado"}
                   }
                }
            }


            try{
                await knex.update({idHistorico,Paciente,Profissional,dtAgendamento,dtConfirmacao,dtAtendimento,historico}).table("historicos");
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
            
        }else{
            return {status: false,err: "O usuário não existe!"}
        }
    }

    async delete(idHistorico){
        var historico = await this.findById(idHistorico);
        if(historico != undefined){

            try{
                await knex.delete().where({idHistorico: idHistorico }).table("historicos");
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
        
        }else{
            return {status: false,err: "O historico não existe para ser deletado."}
        }
    }

}

module.exports = new Historico();