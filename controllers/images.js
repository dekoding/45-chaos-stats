const fs = require('fs')
const path = require('path');
const imageDir = path.resolve(__dirname + '/../public/images/')
const unknownImage = imageDir + '/unknown.JPG'

module.exports = {

  sendImage(req, res) {
    imagePath = imageDir + '/' + req.params.id + '.JPG'
    fs.access(imagePath, function (error) {
      if (error) {
        res.sendFile(unknownImage)
      } else {
        res.sendFile(imagePath)
      }
    })
  }

}
