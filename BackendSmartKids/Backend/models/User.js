var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User{
    async findByEmail(email){
        try{
            var result = await knex.select(["idUsuario","email","senha","tipoUsuario"]).where({email:email}).table("usuarios");
            
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

    async findAll(){
        try{
            var result = await knex.select(["idUsuario","email","senha","tipoUsuario"]).table("usuarios");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

    async findByTipo(tipoUsuario){
        try{
            return await knex('usuarios')
                .leftJoin('cadastros', 'usuarios.idUsuario', 'cadastros.Usuario')
                .select(
                    'usuarios.idUsuario',
                    'usuarios.email',
                    'usuarios.tipoUsuario',
                    'cadastros.nome',
                    'cadastros.sobrenome'
                )
                .where('usuarios.tipoUsuario', tipoUsuario);
        }catch(err){
            console.log(err);
            return [];
        }
    }
    
    async findById(idUsuario){
        try{
            var result = await knex.select(["idUsuario","email","senha","tipoUsuario"]).where({idUsuario:idUsuario}).table("usuarios");
            
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

    async new(email,senha,tipoUsuario){
        try{
            var hash = await bcrypt.hash(senha, 10);
            await knex.insert({email,senha: hash,tipoUsuario}).table("usuarios");
            console.log('Usuário criado com sucesso!');
        }catch(err){
            console.log('Erro ao criar usuário:', err);
        }
    }   

    async findEmail(email){
        try{
            var result = await knex.select("*").from("usuarios").where({email: email});
            
            if(result.length > 0){
                return true;
            }else{
                return false;
            }

        }catch(err){
            console.log(err);
            return false;
        }
    }

    async update(idUsuario, email, senha, tipoUsuario){

        var user = await this.findById(idUsuario);

        if(user != undefined){

            var editUser = {};

            if(email != undefined){ 
                if(email != user.email){
                   var result = await this.findEmail(email);
                   if(result == false){
                        editUser.email = email;
                   }else{
                        return {status: false,err: "O e-mail já está cadastrado"}
                   }
                }
            }

            //if(name != undefined){
            //    editUser.name = name;
            //}

            //if(role != undefined){
            //    editUser.role = role;
            //}

            try{
                await knex.update({tipoUsuario}).where({idUsuario: idUsuario}).table("usuarios");
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
            
        }else{
            return {status: false,err: "O usuário não existe!"}
        }
    }

    async delete(idUsuario){
        var user = await this.findById(idUsuario);
        if(user != undefined){

            try{
                await knex.delete().where({idUsuario: idUsuario}).table("usuarios");
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
        
        }else{
            return {status: false,err: "O usuário não existe, portanto não pode ser deletado."}
        }
    }

    async changePassword(newPassword,idUsuario,token){
        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update({senha: hash}).where({idUsuario: idUsuario}).table("usuarios");
        await PasswordToken.setUsed(token);
    }
}

module.exports = new User();