const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    image: { type: String  }, // URL or path to the image
    bannerImage: { type: String  },
    title: { type: String  },
    body: { type: String  },
    slug: { type: String, unique: true },


}, { timestamps: true }); // Adds createdAt and updatedAt fields

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
