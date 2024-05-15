const path=require('path');
const PORT=4444;
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const hbs=require('hbs');
const flash=require('connect-flash');
const passport=require('./auth/passport');
const Product=require('./models/Products');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const multer=require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
  
const upload = multer({})

app.use(upload.single('image'));

app.use(flash());
app.use(express.urlencoded({extended: true}));
app.set('view engine','hbs');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname+'/views/partials'));
require('dotenv').config();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({mongoUrl: process.env.MONGO_URL})
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res, next) => {
    res.redirect('/signup');
})

const isNotLoggedIn=require('./middlewares/checkLoggedIn');
app.use('/signup',isNotLoggedIn,require('./routes/signup'));
app.use('/login',isNotLoggedIn,require('./routes/login'));

const isLoggedIn=require('./middlewares/isLoggedIn');
app.use('/admin',isLoggedIn,require('./routes/admin'));
app.use('/shop',isLoggedIn,require('./routes/shop'));

app.use('/deleteProduct',async (req,res,next)=>{
  let {id}=req.query;
  try{
    await Product.deleteOne({_id: id});
    res.redirect('/admin/products');
  }
  catch(err){
    return next(err);
  }
})

app.get('/logout', function (req, res, next) {
  req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
  });
});

mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log("http://localhost:"+PORT);
        })
    })
    .catch((err)=>{
        console.log(err);
    })