 // Postgres DATABASE_RUL = postgress://user:passwd@host:port/database
 // SQLite   DATABASE_URL = sqlite://:@:/
 var url      = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
 var DB_name  = (url[6] || null);
 var user     = (url[2] || null);
 var pwd      = (url[3] || null);
 var protocol = (url[1] || null);
 var dialect  = (url[1] || null);
 var port     = (url[5] || null);
 var host     = (url[4] || null);
 var storage  = process.env.DATABASE_STORAGE;


var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd,
								{dialect: dialect, 
								 protocol: protocol,
								 port: port,
								 host: host,
								 storage: storage, // solo SQLite (.env)
								 omitNull: true    // solo Postgres
								}
							);

// Importar la definición de la tabla Quiz en quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var Comment = sequelize.import(path.join(__dirname, 'comments'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);



exports.Quiz = Quiz; // exportar la definición de la tabla Quiz
exports.Comment = Comment;
// sequelize.sync() crea e inicializa tabla de preguntas de DB
sequelize.sync().then(function(){
	Quiz.count().then(function(count) {
		if (count === 0) {
			Quiz.create({pregunta: 'Capital de Portugal',
						 respuesta: 'Lisboa',
						 tematica: 'otro'
						});
			Quiz.create({pregunta: 'Capital de Italia',
						 respuesta: 'Roma',
						 tematica: 'otro'
						}).then(function(){console.log('Base de datos inicializada')});
		};
	});
});