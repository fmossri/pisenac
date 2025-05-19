var knex = require("../database/connection");

class Cadastro{
    async findAll(){
        try{
            var result = await knex.select(["idCadastro","nome","sobrenome","documento","endereco","cep"]).table("cadastros");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

    async findById(idCadastro){
        try{
            var result = await knex.select(["idCadastro","nome","sobrenome","documento","endereco","cep"]).where({idUsuario:idCadastro}).table("cadastros");
            
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

    async findByUsuario(idUsuario){
        try{
            var result = await knex.select("*").from("cadastros").where({Usuario: idUsuario});
            return result.length > 0 ? result[0] : null;
        }catch(err){
            console.log(err);
            return null;
        }
    }
    
    async findByDocumento(documento) {
        try{
            var result = await knex.select("*").from("cadastros").where({documento: documento});
            return result.length > 0 ? result[0] : null;
        }catch(err){
            console.log(err);
            return null;
        }
    }

    async new(Usuario, nome, sobrenome, documento, endereco, cep, docProfSaude) {
        await knex.insert({
            Usuario,
            nome,
            sobrenome,
            documento,
            endereco,
            cep,
            docProfSaude
        }).table("cadastros");
    }   
    async update(idCadastro,nome,sobrenome,documento,endereco,cep){

        var cadastro = await this.findById(idCadastro);

        if(cadastro != undefined){

            var editCadastro = {};

            if(idCadastro != undefined){ 
                if(idCadastro != cadastro.idCadastro){
                   var result = await this.findById(idCadastro);
                   if(result == false){
                        editCadastro.idCadastro = idCadastro;
                   }else{
                        return {status: false,err: "Já está cadastrado"}
                   }
                }
            }

            try{
                await knex.update({idCadastro,nome,sobrenome,documento,endereco,cep}).where({idCadastro: idCadastro}).table("cadastros");
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
            
        }else{
            return {status: false,err: "O usuário não existe!"}
        }
    }

    async delete(idCadastro){
        var cadastro = await this.findById(idCadastro);
        if(cadastro != undefined){

            try{
                await knex.delete().where({idCadastro: idCadastro}).table("cadastros");
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
        
        }else{
            return {status: false,err: "O usuário não existe para ser deletado."}
        }
    }

}

module.exports = new Cadastro();