
/* Iniciación de variables
   Creacion de Servidor
*/

var express = require ('express');
var logger = require ('morgan');
var cookieParser = require ('cookie-parser');
var methodOverride = require ('method-override');
var bodyParser = require('body-parser');

/*Base de datos */
var neo4j = require('node-neo4j');
db = new neo4j('http://neo4j:Luisneri1.@localhost:7474');


var router = express.Router();
var api = express.Router();
//var users = require('./routes/users');

var app = express();

/* Configuracion */
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(bodyParser.json());
app.use(methodOverride());

// Localización de los ficheros estaticos
app.use(express.static(__dirname + '/app'));

/* Log consola */
app.use(logger('dev'));

/* Rutas de la pagina principal index,js */
/* Get pagina principal de la aplicación */
/*router.get('/', function (req, res, next){
	res.send("Hola desde Neo4j");
  //res.render('index.html', { title : 'DeportesTime'});
});
*/
api.get('/', function (req,res,next){
	res.send("Hola desde la api de Neo4j");
})

api.get('/proyecto', function(req,res,next){
  db.cypherQuery('MATCH (n) WHERE n.categoria in ["Artist", "Author", "Community", "Food-Beverages", "Musician-Band", "PublicFigure", "Restaurant-Cafe","SchoolSportsTeam"] RETURN n', function(err, result){
      if(err) {
        res.send(err);
      }

      res.json(result.data);
  });
})

/*MATCH (n:Node)-[:like]->(vecino:Node)-[:like]->(foaf:Node) WHERE n.id = "61213649618" AND n <> foaf AND NOT (n) -[:like]->(foaf)AND foaf.categoria in ["Artist", "Food-Beverages", "Music-Band", "Restaurant-Cafe"] AND vecino.categoria in ["Artist", "Food-Beverages", "Music-Band", "Restaurant-Cafe"] RETURN (foaf), (vecino)*/


api.get('/recomendacion', function(req,res,next){
  db.cypherQuery('MATCH (n:Node)-[:like]->(vecino:Node)-[:like]->(foaf:Node) WHERE n.id = "61213649618" AND n <> foaf AND NOT (n) -[:like]-> (foaf) RETURN (foaf)', function(err, result){
      if(err) {
        res.send(err);
      }
      res.json(result.data);
  });
})

api.get('/recomendacion/:id', function(req,res,next){
  db.cypherQuery('MATCH (n:Node {id : {id}})-[:like]->(vecinos) AND vecinos.categoria in ["Artist", "Food-Beverages", "Music-Band", "Restaurant-Cafe"] AND vecino.categoria in ["Artist", "Food-Beverages", "Music-Band", "Restaurant-Cafe"]  RETURN (vecinos)',{id : req.params.id} ,function(err, result){
      if(err) {
        res.send(err);
      }
      res.json(result.data);
  });
})

api.get('/recomendacionhijosdehijos/:id', function(req,res,next){
  db.cypherQuery('MATCH (n:Node)-[:like]->(vecino:Node)-[:like]->(foaf:Node) WHERE n.id = {id} AND n <> foaf AND NOT (n) -[:like]->(foaf)  RETURN (foaf)',{id : req.params.id} ,function(err, result){
      if(err) {
        res.send(err);
      }
      res.json(result.data);
  });
})

api.get('/base', function(req,res,next){
  db.cypherQuery('MATCH (n) RETURN n', function(err, result){
      if(err) {
        res.send(err);
      }

      res.json(result.data);
  });
})

api.get('/base/:categoria', function(req,res,next){
  db.cypherQuery('MATCH (n : Node {categoria:{categoria}}) return n',{categoria : req.params.categoria}, function(err, result){
      if(err) {
        res.send(err);
      }

      res.json(result.data);
  });
})


api.get('/nodo', function (req,res,next){//Run raw cypher with params
	db.cypherQuery('MATCH (n : Node {id:{id}}) return n',{id : "61213649618"},function(err, result){
      if(err) {
        res.send(err);
      }
      res.json(result.data); 
  });
})

api.get('/nodo/:id', function (req,res,next){//Run raw cypher with params
  var idd = req.params.id;
  db.cypherQuery('MATCH (n : Node {id:{id}}) return n',{id : idd},function(err, result){
      if(err) {
        res.send(err);
      }
      res.json(result.data); 
  });
})

api.get('/nodo/vecinos/:id', function(req, res) {
    var idd = req.params.id;
    db.cypherQuery('MATCH (n:Node {id:{id}}) -[:like]-> (hijos) return (hijos)',{id : idd},function(err, result){
      if(err) {
        res.send(err);
      }
      res.json(result.data); 
  });
})

api.get('/nodo/vecinos/:id/:categoria', function(req, res) {
    db.cypherQuery('MATCH (n:Node {id:{id}}) -[:like]-> (hijos) WHERE hijos.categoria = {categoria} return hijos', {id : req.params.id, categoria : req.params.categoria} ,function(err, result){
      if(err) {
        res.send(err);
      }
      res.json(result.data); 
  });
})

api.get('/comidas', function(req,res){
  db.cypherQuery('MATCH (inicial:Node {id:"61213649618"}) -[:like*..2]-> (hijos) WHERE hijos.categoria = "Food-Beverages" RETURN (hijos)', function(err, result){
      if(err) {
        res.send(err);
      }
      res.json(result.data); 
  });
})

api.get('/comidas/:id', function(req,res){
  db.cypherQuery('MATCH (inicial:Node {id:{id}}) -[:like*..3]-> (hijos) WHERE hijos.categoria = "Food-Beverages" RETURN (hijos)', {id : req.params.id}, function(err, result){
      if(err) {
        res.send(err);
      }
      res.json(result.data); 
  });
})

app.use('/api',api);

app.listen(3000, function(){
	console.log("Server running http://localhost:3000");
});

