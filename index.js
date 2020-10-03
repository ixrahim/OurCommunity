const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

const app = express();
const connection = mongoose.connect(
    'mongodb://127.0.0.1:27017/admin',
    //'mongodb+srv://bash:abisola14@cluster0.dyg9b.mongodb.net/cluster0',
    {
        useMongoCLient: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopaology: true
    }
).catch(err => console.log('database error code :' + err + ' was delivered.'));

const MongoStore = require('connect-mongo')(session)
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions'})

// express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

//setting view engine 
app.set('view engine', 'hbs')
app.engine('hbs', require('hbs').__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
});

// expose needed files
// app.use(express.static(path.join(__dirname, 'node_modules/waypoints')))
// app.use(express.static(path.join(__dirname, 'node_modules/bootstrap')))
// app.use(express.static(path.join(__dirname, 'node_modules/jquery')))
// app.use(express.static(path.join(__dirname, 'node_modules/animate.css')))
app.use("/public", express.static(path.join(__dirname, 'public')))
app.use("/views", express.static(path.join(__dirname, 'views')))
// app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
    res.render('index')
});

// handle errors
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
})
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message
    })
})
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port, () => {
    console.log('server created an listening on port 8000')
})