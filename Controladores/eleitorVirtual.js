const knex = require('../knex');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');

const pwd = securePassword();

const cadastroVirtual = async (req, res) => {
  const { cpf, rg, email, senha, repetirSenha } = req.body;

  try{
    const buscarEleitor = await knex('eleitores').where({cpf, rg}).first();

    if(!buscarEleitor){
      return res.status(400).json('Eleitor não cadastrado, verifique o cpf e o rg!');
    }

    const verificarSenha = (senha === repetirSenha);

    if(!verificarSenha){
      return res.status(400).json('Senhas não compatíveis!');
    }

    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

    const novoCadastro = await knex('usuarios').insert({email, senha: hash, id_eleitor: buscarEleitor.id});

    if(!novoCadastro){
      return res.status(400).json('Não foi possível realizar o cadastro virtual!');
    }

    return res.status(200).json(novoCadastro);
  } catch (error){
    return res.status(400).json(error.message)
  }
}

const fazerLogin = async (req, res) => {
  const {email, senha } =req.body;

  try{
    const buscarEleitor = await knex('eleitores')
    .join('usuarios', 'eleitores.id', 'usuarios.id_eleitor')
    .where({email})
    .first();

    if(!buscarEleitor){
      return res.status(400).json('Não foi possível localizar o eleitor!');
    }

    const verificarSenha = await pwd.verify(Buffer.from(senha), Buffer.from(buscarEleitor.senha, 'hex'));

    switch (verificarSenha) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
      case securePassword.INVALID:
        return res.status(400).json('mensagem: email  ou senha incorreto');
      case securePassword.VALID:
        break;
      case securePassword.VALID_NEEDS_REHASH:
        try {
          const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
          await knex('usuarios').update({senha: hash, email}).where({id});
        } catch {
        }
      break;
    }

    const token = jwt.sign({
      id: buscarEleitor.id,
      email: buscarEleitor.email
    }, 'senhasupersecreta', {expiresIn:'1h'});

    return res.status(200).json({
      permissao: {
        nome: buscarEleitor.nome_eleitor,
        email: buscarEleitor.email
      },
      token
    });
  }catch (error) {
    return res.status(400).json(error.message)
  }
}

const atualizarConta = async (req, res) => {
  const { permissao } = req;

  if(!permissao){
    return res.status(401).json('Usuário não autorizado!');
  }

  try {
    const buscarEleitor = await knex('eleitores')
    .join('usuarios', 'eleitor.id', 'usuarios.id_eleitor')
    .where({id})
    .first();

    if(!buscarEleitor){
      return res.status(400).json('Nenhum')
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  cadastroVirtual,
  fazerLogin
}