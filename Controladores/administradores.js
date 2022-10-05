const knex = require('..knex/');

const cadastrarAdministrador = async (req, res) => {
  const {nome_adm, nascimento, nacionalidade, cpf, rg,orgao_de_expediente, pis, pis_numero, pis_serie} = req.body;

  try {
    const buscarAdm = await knex('administradores').where({id}).first();

    if(buscarAdm){
      return res.status(400).json('Administrador já cadastrado!')
    }

    const addCarteiraTrabalho = await knex('carteiratrabalho').insert({pis, pis_numero, pis_serie});

    if(!addCarteiraTrabalho){
      return res.status(400).json('Não foi possível adicionar os dados da carteira de trabalho do administrador')
    }

    const buscarCarteira = await knex('carteiratrabalho').orderBy('desc', 'id').first();

    if(!buscarCarteira){
      return res.status(400).json('Não foi possível localizar a carteira de trabalho do administrador!');
    }

    const novoAdm = await knex('administradores')
    .insert({
      nome_adm, 
      nascimento, 
      nacionalidade, 
      cpf, 
      rg, 
      orgao_de_expediente, 
      id_carteira: buscarCarteira.id
    });

    if(!novoAdm){
      return res.status(400).json('Não foi possível adicionar o novo administrador');
    }

    return res.status(200).json('Administrador cadastrado com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const listarAdministradores = async (req, res) => {
  try {
    const listarAdm = await knex('administradores')
    .join('carteiratrabalho as ct', 'administradores.id_carteira', 'ct.id');

    if(!listarAdm){
      return res.status(400).json('Não foi possível listar os administradores do sistema!');
    }

    return res.status(200).json(listarAdm);
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const detalharAdministrador = async (req, res) => {
  const { id } =req.params;

  try {
    const buscarAdm = await knex('administradores')
    .join('carteiratrabalho as ct', 'administradores.id_carteira', 'ct.id')
    .where({id})
    .first()

    if(!buscarAdm){
      return res.status(400).json('Não foi possível buscar o administrador!');
    }

    return res.status(200).json(buscarAdm);
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const deletarAdministrador = async (req, res) => {
  const { id } = req.params;
  const { administrador } = req;

  if(!administrador){
    return res.status(401).json('Administrador não autorizado!');
  }

  try {
    const buscarAdm = await knex('administradores').where({id}).first();

    if(!buscarAdm){
      return res.status(400).json('Não foi possível localizar o administrador!');
    }

    const deletar_carteira = await knex('carteiratrabalho').where({id: buscarAdm.id}).del();

    if(!deletar_carteira){
      return res.status(400).json('Não foi possível deletar a carteira de trabalho do administrador!');
    }

    const deletar_adm = await knex('administradores').where({id}).del();

    if(!deletar_adm){
      return res.status(400).json('Não foi possível deletar o administrador!');
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  cadastrarAdministrador,
  listarAdministradores,
  deletarAdministrador,
  detalharAdministrador
}