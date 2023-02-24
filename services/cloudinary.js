const cloudinary = require('cloudinary');


cloudinary.v2.config({ 
    cloud_name: 'do7t2hjus', 
    api_key: '646676111765393', 
    api_secret: '0uDl-4kqC-8NDRMuPdZqda15I_A' 
  });

  module.exports = cloudinary.v2;