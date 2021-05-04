const express = require('express');

const server = express();

// ativando o uso de json
server.use(express.json());

// CRUD - Create - Read - Update - Delete

const users = ['Rubens', 'Aurélio', 'Alberto', 'Laureano'];

// Middleware global

server.use((req, res, next) => {
    console.time('request');
    console.log(`Método: ${req.method}, URL: ${req.url}` );
    
    next();

    console.timeEnd('request');
});

// Middleware local
function checkUserNameExists(req, res, next) {

    if(!req.body.nome) {
        return res.status(400).json({ error: 'User name is required!'});
    } 
    return next();
}

function checkUserInArray(req, res, next) {
    
    const user = users[req.params.index];

    if(!user) {
        return res.status(400).json({ error: 'User does not exists!'});
    }

    req.user = user;
    next();
}


// read
server.get('/users', (req, res) => {
    return res.json(users);
})

// listar um usuário
server.get('/users/:index', checkUserInArray, (req, res) => {

    return res.json({message: `Exibindo o usuário ${req.user}`});
});

// create
server.post('/users', checkUserNameExists, (req, res) => {
    
    const { nome } = req.body;

    users.push(nome);

    return res.json(users);
});

// update
server.put('/users/:index', checkUserNameExists, checkUserInArray, (req, res) => {

    const { index } = req.params;
    const { nome } = req.body;

    users[index] = nome;

    return res.json(users);

});

// delete
server.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.send();
});

server.listen(3000, () => {
    console.log('servidor de testes ativo na porta 3000!');
});