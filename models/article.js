// Use the mongoose module for handling MongoDB connection
const mongoose = require('mongoose')

// Use the marked module to parse markdown to HTML
const marked = require('marked')

// Use the slugify module to make articles id human-readable, unique and URL compliant
const slugify = require('slugify')

// Use the dompurify module to sanitize the HTML that comes out marked module
const createDomPurify = require('dompurify')

// Use the jsdom module to run Js server side
const { JSDOM } = require('jsdom')

// Makes dompurify and jsdom working together
const dompurify = createDomPurify(new JSDOM().window)

// Define the shape of a collection and settings for every values of the article element
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required : true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

// Post middleware to generate the slug and sanitizedHtml
articleSchema.pre('validate', function(next) {
  if (this.title) {
    // Call slugify module with title and option object as parameter to store the slug value in DB
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    })
  }
  if (this.markdown) {
    // Generate HTML from the markdown text then sanituze it to store it in the DB as sanitizedHtml
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  // Call the next middleware
  next()
})

// Compile and export a model from the schema
module.exports = mongoose.model('Article', articleSchema)
