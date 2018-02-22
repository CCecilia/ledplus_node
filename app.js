const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const fileUpload = require('express-fileupload');

const index = require('./routes/index');
const users = require('./routes/users');
const sales = require('./routes/sales');
const leds = require('./routes/leds');
const reps = require('./routes/reps');
const service_classes = require('./routes/service_classes');
const state_rates = require('./routes/state_rates');

const User = require('./models/user');

const app = express();

// database setup
const mongoDB = 'mongodb://localhost:27017/ledplus';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(favicon(path.join(__dirname, 'public', 'ledplus_icon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const store = new MongoDBStore({
  uri: mongoDB,
    collection: 'user_session'
  });
  // Catch errors
  store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});
app.use(session({
  secret: 'f-_k-o5+&x34=b)xh@w-fuk7=k4gz7l1&s2i&3mp*oj#^i=z80',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}))
app.use(fileUpload());

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;
      }
      next();
    });
  } else {
    next();
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/sales', sales);
app.use('/LEDs', leds);
app.use('/serviceClasses', service_classes);
app.use('/retailEnergyProviders', reps);
app.use('/stateRates', state_rates);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
