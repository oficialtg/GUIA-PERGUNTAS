const express = require ("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Perguntas = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//Database
     
connection.authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch(erro => {
        console.error('Erro ao conectar:', erro);
    })


// Estou dizendo para o Expresss usar o EJS como view engine
app.set('view engine','ejs');
app.use(express.static('public'));
// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Rotas
app.get("/", (req, res) => {
    Perguntas.findAll({raw: true, order:[
        ['id','DESC'] // ASC = Crescente // DESC = Decrescente
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    }); 
});

app.get("/perguntar",(req, res)=>{
    res.render("perguntar");

});

app.post("/salvarpergunta",(req,res) => {
         var titulo = req.body.titulo;
         var descricao = req.body.descricao;
         Perguntas.create({
             titulo: titulo,
            descricao: descricao
            }).then(() => {
                res.redirect("/");
         });
});

app.get("/pergunta/:id",(req,res) => {
         var id = req.params.id;
         Perguntas.findOne({
            where: {id: id}
         }).then(perguntas => {
              if( perguntas != undefined){ // Pergunta achada

                 Resposta.findAll({
                    where: {perguntaId: perguntas.id},
                    order:[ 
                            ['id', 'DESC']
                    ]
                   }).then(resposta => { 
                   res.render("pergunta",{
                        perguntas: perguntas,
                        resposta: resposta 
                      });
                  
                  });
                        
              }else{ // Não encontrada
                  res.redirect("/");
              }
         });
});

app.post("/responder", (req, res) => {
      var corpo = req.body.corpo;
      var perguntaId = req.body.perguntas;
      Resposta.create({
         corpo: corpo,
         perguntaId: perguntaId
    }).then(() => {
         res.redirect("/pergunta/"+perguntaId); 
    });
});

app.listen(8080,()=>{console.log("App rodando!");});