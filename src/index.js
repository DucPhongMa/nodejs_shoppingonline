const path = require('path')
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')

const handlebars = require('express-handlebars');

const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const validator = require('express-validator')
const MongoStore = require('connect-mongo');


const paginate = require('handlebars-paginate');
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000

const route = require('./routes')
const db = require('./config/db')

//Method Override
app.use(methodOverride('_method'))


//HTTP logger
app.use(morgan('combined'))

//Template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => parseFloat(a) + parseFloat(b),
    if_equal: function(a, b, opts) {
      if (a == b) {
          return opts.fn(this)
      } else {
          return opts.inverse(this)
      }
    },
    paginate: paginate
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'resources','views'));

//Connect to db
db.connect();

//Static File
app.use(express.static(path.join(__dirname,'public')))

require('./config/passport')


app.use(cookieParser())

//Request not undefined
app.use(express.json());
app.use(express.urlencoded({
  extended:true,
}));




//Setup express-session
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/Online_Shopping' }),
  cookie: { maxAge: 180 * 60 * 1000}
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(validator());


app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.username = req.session.user ? req.session.user.username : '';
  
  next();
})





route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})