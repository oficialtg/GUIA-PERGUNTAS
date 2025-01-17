const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', '170119',{
        host: 'localhost',
        dialect: 'mysql'
});

module.exports = connection;
