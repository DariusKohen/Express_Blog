// Use the express module
const express = require('express')

// Use the mongoose module for handling MongoDB connection
const mongoose = require('mongoose')

// Use the Article module as model from mongoose article schema
const Article = require('./models/article')

// Use the articles router module
const articleRouter = require('./routes/articles')

// Use the method-override module to simulate DELETE and PUT method from basic HTML forms
const methodOverride = require('method-override')

// Create an object of the express module
const app = express()

// Init and connect DataBase with URI 'MONGODB_URI' in env or a localhost one
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

// Setup ejs library
app.set('view engine', 'ejs')

// Mount express urlencoder middleware
app.use(express.urlencoded({ extended: false }))

// Mount method-override middleware
app.use(methodOverride('_method'))

// Create path for using files in public folder
app.use('/static', express.static(__dirname + '/public'));

// Create an asynchronous callback function on '/' route with GET method
app.get('/', async (req, res) => {
  // Use Article model to get all articles sorted by 'createdAt' value and limited to 10 articles
  // The await keywork is to make the function asynchronous and wait DB response
  const articles = await Article.find().sort({ createdAt: 'desc' }).limit(10)
  // Render the view 'core' with 'articles', 'page' and 'title' in the options object
  res.render('core', {
    articles: articles,
    page: 'articles/index',
    title: 'Welcome to this Blog !'
  })
})

// Mount articleRouter at the '/articles' path
app.use('/articles', articleRouter)

// Make the server listen on port 'PORT' in env or 3000
app.listen(process.env.PORT || 3000)
