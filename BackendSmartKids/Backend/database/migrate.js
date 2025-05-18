const knex = require('./connection'); // aqui você importa sua configuração do Knex

async function criarTabelas() {
  const existeTipo = await knex.schema.hasTable('tipousuarios');
  if (!existeTipo) {
    await knex.schema.createTable('tipousuarios', (table) => {
      table.increments('idTipoUsuario').primary();
      table.string('descricao', 45).notNullable().unique();
    });
    console.log('Tabela tipousuarios criada.');
  }

  const existeUsuarios = await knex.schema.hasTable('usuarios');
  if (!existeUsuarios) {
    await knex.schema.createTable('usuarios', (table) => {
      table.increments('idUsuario').primary();
      table.string('email', 50).notNullable().unique();
      table.string('senha', 250).notNullable();
      table.integer('tipoUsuario').unsigned().notNullable()
        .references('idTipoUsuario').inTable('tipousuarios')
        .onDelete('RESTRICT').onUpdate('CASCADE');
    });
    console.log('Tabela usuarios criada.');
  }

  const existeCadastros = await knex.schema.hasTable('cadastros');
  if (!existeCadastros) {
    await knex.schema.createTable('cadastros', (table) => {
      table.increments('idCadastro').primary();
      table.integer('Usuario').unsigned().unique()
        .references('idUsuario').inTable('usuarios')
        .onDelete('RESTRICT').onUpdate('CASCADE');
      table.string('nome', 50).notNullable();
      table.string('sobreNome', 45).notNullable();
      table.string('documento', 14).notNullable().unique();
      table.string('docProfSaude', 14);
      table.string('endereco', 50);
      table.integer('cep', 11);
    });
    console.log('Tabela cadastros criada.');
  }

  const existeHistoricos = await knex.schema.hasTable('historicos');
  if (!existeHistoricos) {
    await knex.schema.createTable('historicos', (table) => {
      table.increments('idHistorico').primary();
      table.integer('Paciente').unsigned().notNullable()
        .references('idUsuario').inTable('usuarios')
        .onDelete('RESTRICT').onUpdate('CASCADE');
      table.integer('Profissional').unsigned().notNullable()
        .references('idUsuario').inTable('usuarios')
        .onDelete('RESTRICT').onUpdate('CASCADE');
      table.dateTime('dtAgendamento');
      table.dateTime('dtConfirmacao');
      table.dateTime('dtAtendimento');
      table.text('historico', 'longtext').notNullable();
    });
    console.log('Tabela historicos criada.');
  }

  await knex.destroy();
  console.log('Todas as tabelas foram criadas com sucesso!');
}

criarTabelas().catch((err) => {
  console.error('Erro ao criar tabelas:', err);
  knex.destroy();
});
