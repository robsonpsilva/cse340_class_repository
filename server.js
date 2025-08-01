/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const express = require("express")
const bodyParser = require("body-parser")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express();
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities")
const session = require("express-session")
const pool = require('./database/')
const  cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


// 2. Body-parser (coloque AQUI se quiser que o middleware acima veja o req.body parseado)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 1. Middleware de log de requisição (este é o que você quer!)
app.use((req, res, next) => {
  console.log('--- Requisição Recebida ---');
  console.log('Método:', req.method);
  console.log('URL Original:', req.originalUrl);
  console.log('Cabeçalhos:', req.headers);

  // Para ver o corpo (body) da requisição, você precisa que o body-parser já tenha agido.
  // Se você colocar este middleware ANTES do body-parser, req.body estará vazio aqui.
  // Se quiser ver o body RAW (não parseado), precisaria de outro tipo de leitura de stream.
  // Para ver o body já parseado (como de um formulário POST), coloque este middleware APÓS os body-parsers.
  console.log('Corpo da Requisição (req.body):', req.body); // Pode estar vazio se antes do body-parser

  console.log('--- Fim da Requisição Recebida ---');
  next(); // IMPORTANTE: Passa a requisição para o próximo middleware/rota
});


/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//Unity 5 :ogin activity
app.use(cookieParser())
app.use(utilities.checkJWTToken)



app.use((req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      res.locals.logedIn = true;
      res.locals.user = user;
    } catch (err) {
      res.locals.logedIn = false;
      res.locals.user = null;
    }
  } else {
    res.locals.logedIn = false;
    res.locals.user = null;
  }

  next();
});

/* ***********************
 * Routes
 *************************/
app.use(static)

//Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

//Account route
app.use("/account", accountRoute)


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
