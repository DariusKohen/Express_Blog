// Use the express module
const express = require('express')

// Import and init the Mongoose library and use our router file
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')

// Create an object of the express module
const app = express()

// Init and connect DataBase
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

// Create a callback function on '/' route with GET method
app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })

  // Render the view 'core' with 'articles' and 'page' in the options object
  res.render('core', {
    articles: articles,
    page: 'articles/index'
  })
})

// Mount articleRouter at the '/articles' path
app.use('/articles', articleRouter)

// Make the server listen on port 3000
app.listen(process.env.PORT || 3000)
