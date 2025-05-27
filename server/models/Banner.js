const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BannerSchema = new Schema({
  headerBannerImage_1: { type: String, required: true }, // URL or path to the image
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const bannerImage = mongoose.model('Banner', BannerSchema);

module.exports = bannerImage;
