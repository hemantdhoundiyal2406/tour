const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  articleTitle: {
    type: String,
    
  },
  articleSubTitle: {
    type: String,
    
  },
  articleBody: {
    type: String,
    
  },
  articleImage: {
    type: String,
    
  },

  articleBannerImage: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   slug: {
    type: String,
    required: true,
   }
});

module.exports = mongoose.model('Article', articleSchema);
