// Use the express module
const express = require('express')


const Article = require('./../models/article')

// Create a new router object
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('core', {
    article: new Article(),
    page: 'articles/new'
  })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('core', {
    article: article,
    page: 'articles/edit'
  })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) {
    // Redirects to the specified path
    res.redirect('/')
  } else {
    res.render('core', {
      article: article,
      page: 'articles/show'
    })
  }
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)

  // Redirects to the specified path
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown

    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      console.log(e)
      res.render('core', {
        article: article,
        page: `articles/${path}`
      })
    }
  }
}

// Export our router object for importing it in the main server file
module.exports = router
