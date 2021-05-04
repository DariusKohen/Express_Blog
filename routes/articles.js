// Use the express module
const express = require('express')

// Use the Article module as model from mongoose article schema
const Article = require('./../models/article')

// Create a new router object
const router = express.Router()

// Callback function called when the path '/new' relative to this router with GET method is called
router.get('/new', (req, res) => {
  // Render the view 'core' with 'article', 'page' and 'title' in the options object
  res.render('core', {
    article: new Article(),
    page: 'articles/new',
    title: 'Add a new article'
  })
})

// Asynchronous Callback function called when the path '/:slug' relative to this router with GET method is called
// The ':slug' is for dynamic routing and interpret what's after '/' as an id
router.get('/:slug', async (req, res) => {
  // Get one Article from the DB with his slug value
  // The await keywork is to make the function asynchronous and wait DB response
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) {
    // Redirects to the specified path
    res.redirect('/')
  } else {
    // Render the view 'core' with 'article', 'page' and 'title' in the options object
    res.render('core', {
      article: article,
      page: 'articles/show',
      title: article.title
    })
  }
})

// Asynchronous Callback function called when the path '/edit/:id' relative to this router with GET method is called
// The ':id' is for dynamic routing and interpret what's after '/edit/' as an id
router.get('/edit/:id', async (req, res) => {
  // Get one Article from the DB with his id
  // The await keywork is to make the function asynchronous and wait DB response
  const article = await Article.findById(req.params.id)
  if (article == null) {
    // Redirects to the specified path
    res.redirect('/')
  } else {
    // Render the view 'core' with 'article', 'page' and 'title' in the options object
    res.render('core', {
      article: article,
      page: 'articles/edit',
      title: `Read the article : ${article.title}`
    })
  }
})

// Asynchronous Callback function called when the path '/' relative to this router with POST method is called
router.post('/', async (req, res, next) => {
  // Create an empty Article
  req.article = new Article()
  // Call for the next middleware
  next()
  // Link the middleware to be called after the 'next' in this function
}, saveArticleAndRedirect('new'))

// Asynchronous Callback function called when the path '/:id' relative to this router with PUT method is called
// The ':id' is for dynamic routing and interpret what's after '/' as an id
router.put('/:id', async (req, res, next) => {
  // Get one Article from the DB with his id
  // The await keywork is to make the function asynchronous and wait DB response
  req.article = await Article.findById(req.params.id)
  // Call for the next middleware
  next()
  // Link the middleware to be called after the 'next' in this function
}, saveArticleAndRedirect('edit'))

// Asynchronous Callback function called when the path '/:id' relative to this router with DELETE method is called
// The ':id' is for dynamic routing and interpret what's after '/edit/' as an id
router.delete('/:id', async (req, res) => {
  // The await keywork is to make the function asynchronous and wait DB response
  await Article.findByIdAndDelete(req.params.id)

  // Redirects to the specified path
  res.redirect('/')
})

// Middleware that save and redirect, used both for create and edit article
function saveArticleAndRedirect(path) {
  // Return a composed article model from the previous middleware datas
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown

    try {
      // The await keywork is to make the function asynchronous and wait DB response
      article = await article.save()
      // Redirect the user to another page
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      // Print the error in the log and redirect to index
      console.log(e)
      res.redirect(`/`)
    }
  }
}

// Export our router module for importing it in the main server file
module.exports = router
