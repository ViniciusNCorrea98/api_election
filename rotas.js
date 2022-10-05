const express = require('express');
const eleitores = require('./Controladores/eleitores');
const administradores = require('./Controladores/administradores');
const eleitor_virtual = require('./Controladores/eleitorVirtual');

const rotas = express();

rotas.post('/administradores', administradores.cadastrarAdministrador);
rotas.get('/administradores', administradores.listarAdministradores);
rotas.get('/administradores/:id', administradores.detalharAdministrador);
rotas.delete('/administradores/:id', administradores.deletarAdministrador);

rotas.post('/eleitores', eleitores.criarEleitor);
rotas.put('/eleitores/:id', eleitores.atualizarEleitor);
rotas.get('/eleitores/detalhar', eleitores.detalharEleitor);
rotas.delete('/eleitores/:id', eleitores.deletarEleitor);

rotas.post('/eleitorvirtual', eleitor_virtual.cadastroVirtual);
rotas.post('/eleitorvirtual/fazerLogin', eleitor_virtual.fazerLogin);

module.exports = rotas;