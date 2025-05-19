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

    async findByPaciente(Paciente){
        try{
            var result = await knex.select(["idHistorico","Paciente","Profissional","dtAgendamento","dtConfirmacao","dtAtendimento","historico"]).where({Paciente:Paciente}).table("historicos");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }


    async findByProfissional(Profissional){
        try{
            var result = await knex.select(["idHistorico","Paciente","Profissional","dtAgendamento","dtConfirmacao","dtAtendimento","historico"]).where({Profissional:Profissional}).table("historicos");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }
    

    async new(Paciente, Profissional, dtConfirmacao, dtAtendimento, historico) {
        if (typeof historico !== 'string' && historico !== null) {
            historico = null;
        }
        try {
            await knex.insert({ 
                Paciente, 
                Profissional, 
                dtConfirmacao, 
                dtAtendimento, 
                historico 
            }).table("historicos");
        } catch (err) {
            console.log(err);
        }
    }   
    async update(idHistorico, Paciente, Profissional, dtConfirmacao, dtAtendimento, historico) {
        if (typeof historico !== 'string' && historico !== null) {
            historico = null;
        }
        
        var existing = await this.findById(idHistorico);

        if(existing != undefined){
            try{
                await knex.update({
                    Paciente,
                    Profissional,
                    dtConfirmacao,
                    dtAtendimento,
                    historico
                }).where({idHistorico: idHistorico}).table("historicos");
                return {status: true}
            }catch(err){
                console.log('Historico Model - Database error:', err);
                return {status: false,err: err}
            }
        }else{
            return {status: false,err: "O histórico não existe!"}
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