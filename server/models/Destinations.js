const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DestinationsSchema = new Schema({
    Destinationsimage : { type: String  }, // URL or path to the image
    DestinationsbannerImage: { type: String  },
    Destinationstitle: { type: String  },
    Destinationsbody: { type: String  },
    slug: { type: String, unique: true },


}, { timestamps: true }); // Adds createdAt and updatedAt fields

const Destinations  = mongoose.model('Destinations ', DestinationsSchema);

module.exports = Destinations ;
