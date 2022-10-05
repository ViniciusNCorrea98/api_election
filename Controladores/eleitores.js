const knex = require('../knex');

const criarEleitor = async (req, res) => {
  const { administrador } = req;
  const {
    nome_eleitor,
    nascimento,
    cpf,
    rg, 
    cidade,
    nacionalidade,
    localVotacao,
    id_imagem,
    regularizado
  } = req.body;

  if(!administrador){
    return res.status(401).json('Administrador não autorizado!');
  }

  try {
    const buscarEleitor = await knex('eleitores').where({cpf}).first();

    if(!buscarEleitor){
      return res.status(400).json('Eleitor já cadastrado!');
    }
  } catch (error) {
    return res.status(400).json(error.message)
  }

  try {
    const novoEleitor = await knex('eleitores').insert({
      nome_eleitor, 
      nascimento, 
      cpf, 
      rg, 
      cidade, 
      nacionalidade, 
      localVotacao, 
      id_imagem,
      regularizado
    });

    if(!novoEleitor){
      return res.status(400).json('Não foi possível cadastrar o eleitor');
    }

    return res.status(200).json('Eleitor cadastrado com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message)
  }
}


const atualizarEleitor = async (req, res) => {
  const { administrador } = req;

  const {
    nome_eleitor,
    nascimento, 
    cpf,
    rg,
    nacionalidade,
    localVotacao,
    id_imagem,
    regularizado,
    cidade
  } = req.body;

  if(!administrador){
    return res.status(400).json('Administrador não autorizado!');
  }

  try {
    const buscarEleitor = await knex('eleitores').where({cpf}).first();

    if(!buscarEleitor){
      return res.status(400).json('Eleitor não encontrado!');
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }

  try {
    const buscarEleitor = await knex('eleitores').where({cpf}).first();

    nome_eleitor = nome_eleitor ? nome_eleitor : buscarEleitor.nome_eleitor;
    nascimento = nascimento ? nascimento : buscarEleitor.nascimento; 
    cpf = cpf ? cpf : buscarEleitor.cpf;
    rg = rg ? rg : buscarEleitor.rg;
    nacionalidade = nacionalidade ? nacionalidade : buscarEleitor.nacionalidade;
    localVotacao = localVotacao ? localVotacao : buscarEleitor.localVotacao;
    id_imagem = id_imagem ? id_imagem : buscarEleitor.id_imagem;
    regularizado = regularizado ? regularizado : buscarEleitor.regularizado;
    cidade = cidade ? cidade : buscarEleitor.cidade;

    const atualizarEleitor = await knex('eleitores').update({
      nome_eleitor,
      nascimento,
      cpf,
      rg,
      nacionalidade,
      localVotacao,
      id_imagem,
      regularizado,
      cidade
    }).where({cpf: buscarEleitor.cpf});

    if(!atualizarEleitor){
      return res.status(400).json('Não foi possível atualizar o eleitor!');
    }

    return res.status(200).json('Eleitor atualizado com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const detalharEleitor = async (req, res) => {
  const { id } = req.params;

  try {
    const buscarEleitor = await knex('eleitores').where({id}).first();

    if(!buscarEleitor){
      return res.status(400).json('Não foi possível localizar o eleitor!');
    }

    return res.status(200).json(buscarEleitor);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const deletarEleitor = async (req, res) => {
  const { id } = req.params;

  if(!administrador){
    return res.status(401).json('Administrador não autorizado!');
  }

  try {
    const buscarEleitor = await knex('eleitores').where({id}).first();

    if(!buscarEleitor){
      return res.status(400).json('Não foi possível localizar o eleitor!');
    }

    const deletarEleitor = await knex('eleitores').where({id}).del();

    if(!deletarEleitor){
      return res.status(400).json('Não foi possível deletar o cadastro do eleitor!');
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  criarEleitor,
  atualizarEleitor,
  deletarEleitor,
  detalharEleitor
}