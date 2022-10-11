const knex = require('../knex');

const criarPartido = async (req, res) => {
  const { administrador } =req;
  const {
    nome_partido,
    numero,
    abreviatura,
    registro
  } = req.body;

  if(!administrador){
    return res.status(401).json('Usuário não autorizado!');
  }

  try {
    const buscarRegistro = await knex('partidos').where({registro}).first();

    if(!buscarRegistro){
      return res.status(400).json('Partido já registrado!');
    }

    const novoPartido = await knex('partidos')
    .insert({
      nome_partido,
      numero,
      abreviatura,
      registro
    });

    if(!novoPartido){
      return res.status(400).json('Não foi possível registrar este partido!');
    }

    return res.status(200).json('Partido cadastrado com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const atualizarPartido = async (req, res) => {
  const { administrador } = req;
  const { id } = req.params;
  const {
    nome_partido,
    numero,
    abreviatura,
    registro
  } = req.body;

  if(!administrador){
    return res.status(401).json('Usuário não autorizado!');
  }

  try {
    const buscarPartido = await knex('partidos').where({id}).first();

    if(!buscarPartido){
      return res.status(400).json('Partido não encontrado!');
    }

    nome_partido = nome_partido ? nome_partido : buscarPartido.nome_partido;
    numero = numero ? numero : buscarPartido.numero;
    abreviatura = abreviatura ? abreviatura : buscarPartido.abreviatura;
    registro = registro ? registro : buscarPartido.registro;

    const atualizar = await knex('partidos')
    .update({ 
      nome_partido, 
      numero, 
      abreviatura, 
      registro
    }).where({id});

    if(!atualizar){
      return res.status(400).json('Partido atualizado com sucesso!');
    }

    return res.stauts(200).json('Partido atualizado com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const listarPartidos = async (req, res) => {
  try {
    const listar = await knex('partidos');

    if(!listar){
      return res.status(400).json('Não foi possível listar a lista de partidos!');
    }

    return res.status(200).json(listar);
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const detalharPartido = async (req, res) => {
  const { id } =req.params;

  try {
    const buscarPartido = await knex('partidos').where({id}).first();

    if(!buscarPartido){
      return res.status(400).json('Não foi possível localizar o partido!');
    }

    return res.status(200).json(buscarPartido)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const deletarPartido = async (req, res) => {
  const { id } =req.params;
  const { administrador } = req;

  if(!administrador){
    return res.status(401).json('Usuário não autorizado!');
  }

  try {
    const buscarPartido = await knex('partidos').where({id}).frist();
    
    if(!buscarPartido){
      return res.status(400).json('Partido não encontrado!');
    }

    const deletar = await knex('partidos').where({id}).del();

    if(!deletar){
      return res.status(400).json('Não foi possível deletar o partido!');
    }

    return res.status(200).json('Usuário deletado com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  criarPartido,
  atualizarPartido,
  listar,
  detalharPartido,
  deletarPartido
}