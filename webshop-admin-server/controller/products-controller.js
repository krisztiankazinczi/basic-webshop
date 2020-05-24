const formidable = require('formidable')
const fs = require('fs');
const uid = require('uid-safe')

module.exports = class ProductsService {
  constructor(productsService) {
    this.productsService = productsService
  }

  insertNewProduct(req, res) {
    const form = formidable({ multiples: true })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error', err)
        throw err
      }

      const { name, price, description, specs, stock, warning_at } = fields;
      let { sku } = fields

      const errorObject = checkExistance({ name, price, description, specs })

      sku = checkOrGenerateSku(sku, name)

      let imagesPath = []; // I will insert data in sql images table according to this array
      // if errorObject is not empty I send back the errors to front-end
      if (Object.keys(errorObject).length) {
        res.json(errorObject)
        return
      }

      try {
        // if there is no uploaded pictures I change the value of imagesPath and in this case no record will be inserted in the images Table
        if (!files.images) imagesPath = undefined;
        // else if should be used because if there is no uploaded image, than files.images will be undefined!! With normal form submit it is a File object with size: 0 property
        // it will be true if someone uploaded only 1 picture

        else if (!Array.isArray(files.images) && files.images.size) files.images = [files.images]
        if (files.images instanceof Array) {
          files.images.forEach((img, index) => {

            const destPath = `./public/images/${sku}`
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath);
            }

            const uniqueFileName = uid.sync(10)

            if (index === 0) {
              imagesPath.push({ path: `images/${sku}/${uniqueFileName}.${img.name.split('.').pop()}`, isPrimaryImage: 1 })
            } else {
              imagesPath.push({ path: `images/${sku}/${uniqueFileName}.${img.name.split('.').pop()}`, isPrimaryImage: 0 })
            }

            fs.rename(
              img.path,
              `${destPath}/${uniqueFileName}.${img.name.split('.').pop()}`,
              err => {
                if (err) {
                  console.log(err)
                }
              }
            )
          })

        }

        const isSkuExists = await this.productsService.isSkuExists(sku)

        if (!isSkuExists) await this.productsService.insertNewProduct({ sku, name, price, description, specs, stock, warning_at }, imagesPath)
        else {
          res.json({ Sku: 'this sku is existing, please change it' })
          return
        }
        // if everything was success, I will send back an empty object
        res.json({})
      } catch (err) {
        console.log(err)
        res.json({ error: 'We were not able to upload the product (server error)' })
      }

    })
  }




  async findProducts(req, res) {
    try {
      const products = await this.productsService.findProducts()
      res.json(products)
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }

  async findProductBySku(req, res) {
    const { sku } = req.params;
    console.log(sku)
    try {
      const product = await this.productsService.findProductBySku(sku)
      res.json(product)
    } catch (error) {
      res.json(error.message)
    }
  }


  async updateProduct(req, res) {
    const form = formidable()

    form.parse(req, async (err, fields) => {
      if (err) {
        console.error('Error', err)
        throw err
      }
      const { sku } = req.params;
      const { name, price, description, specs, stock, warning_at } = fields;
      // Validation start - sku is correct, no validation needed
      const errorObject = checkExistance({ name, price, description, specs, stock, warning_at })

      if (Object.keys(errorObject).length) {
        res.json(errorObject)
        return
      }
      // Validation ends
      try {
        console.log(`hol van az sku: ${sku}`)
        await this.productsService.updateProduct({ name, price, description, specs, stock, warning_at }, sku)
        res.json({})
      } catch (error) {
        res.json({ error: 'We are really sorry, but the product update failed due to database error' })
      }

    })
  }


  async updatePrimaryImage(req, res) {
    const { id } = req.params;

    try {
      const images = await this.productsService.updatePrimaryImage(id)
      res.json(images)
    } catch (error) {
      console.log(error)
      res.json({ error: 'We are really sorry, but the product update failed due to database error' })
    }


  }

  async deleteImage(req, res) {
    const { id } = req.params
    try {
      const path = await this.productsService.findPathOfPicId(id)
      if (path) {
        fs.unlink(`public/${path}`, (err) => {
          if (err) throw err;
        });
        const images = await this.productsService.deleteImage(id)
        res.json({ images })
        return
      }
      res.json({ error: 'This pictureID not existing in our database' })
    } catch (error) {
      res.json({ error: 'We are really sorry, but the product update failed due to database error' })
    }

  }




  async addNewImages(req, res) {
    const form = formidable({ multiples: true })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error', err)
        throw err
      }
      let { sku } = req.params

      let imagesPath = [];

      try {
        const isPrimaryImgExists = await this.productsService.isPrimaryImgExists(sku)

        if (!files.images) {
          imagesPath = undefined;
        }


        else if (!Array.isArray(files.images) && files.images.size) {
          files.images = [files.images]
        }
        if (files.images instanceof Array) {
          files.images.forEach((img, index) => {

            const destPath = `./public/images/${sku}`
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath);
            }

            const uniqueFileName = uid.sync(10)

            if (index === 0 && !isPrimaryImgExists) {
              imagesPath.push({ path: `images/${sku}/${uniqueFileName}.${img.name.split('.').pop()}`, isPrimaryImage: 1 })
            } else {
              imagesPath.push({ path: `images/${sku}/${uniqueFileName}.${img.name.split('.').pop()}`, isPrimaryImage: 0 })
            }

            fs.rename(
              img.path,
              `${destPath}/${uniqueFileName}.${img.name.split('.').pop()}`,
              err => {
                if (err) {
                  console.log(err)
                }
              }
            )
          })

          const images = await this.productsService.addNewImagesToSku(imagesPath, sku)

          res.json({ images })
        }



      } catch (error) {

      }

    })

  }



  async getSkus(req, res) {
    try {
      const skus = await this.productsService.getSkus()
      res.json({ skus })
    } catch (error) {
      res.json({ error: 'We are sorry, but we can not reach the databe. Please try again later!' })
    }
  }


  async createOffer(req, res) {
    const form = formidable()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error', err)
        throw err
      }

      try {
        const destPath = `./public/offers`
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath);
        }
        const uniqueFileName = uid.sync(10)

        const imagePath = `${uniqueFileName}.${files.image.name.split('.').pop()}`


        fs.rename(
          files.image.path,
          `${destPath}/${uniqueFileName}.${files.image.name.split('.').pop()}`,
          err => {
            if (err) {
              console.log(err)
            }
          })
        console.log(fields.marketingText, fields.sku, imagePath)
        await this.productsService.addNewOffer(fields.marketingText, fields.sku, imagePath)

        res.json({})
      }



      catch (error) {
        console.log(error)
      }

    })
  }


  async findOffers(req, res) {
    try {
      const offers = await this.productsService.findOffers()
      res.json({ offers })
    } catch (error) {
      res.json({ error: 'We are sorry, but we can not reach the databe. Please try again later!' })
    }
  }



  async deleteOffer(req, res) {
    const { id, imagePath } = req.params;

    try {

        fs.unlink(`public/offers/${imagePath}`, async (err) => {
          if (err) throw err;
          else {
            await this.productsService.delOffer(id)
            res.json({})
            }
        });
        

    } catch (error) {
      res.json({ error: 'We are really sorry, but the product update failed due to database error' })
    }
  }

  async updateRecommendations(req, res) {
    const {sku} = req.params
    const {recommendations} = req.body

    try {
      await this.productsService.updateRecommendations(sku, recommendations)
    } catch (error) {
      console.log(error)
    }
  }


  async findProductDetailsToClients(req, res) {
    try {
      const data = await this.productsService.findProductDetailsToClients()
      console.log(data)
      res.json(data)
    } catch (error) {
      
    }
  }


}







function checkExistance(validationValues) {
  let errorObject = {}
  // if any field were empty, we create an error message
  for (let [key, value] of Object.entries(validationValues)) {

    if (!value) errorObject[`${key}`] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
    else {
      const result = checkOtherCriterias(key, value)
      // if result is false, then we don't add a new property in the errorObject
      if (result) errorObject[`${key}`] = result.errorMessage
    }
  }
  return errorObject;
}

function checkOtherCriterias(key, value) {
  // the maximum length of the description field is 240 characters
  if (key === 'description') {
    if (value.length > 240) return { 'errorMessage': 'The description is too long, 240 character maximum length is allowed' }
    else return false
  }
  // specs field has a unique format requirement, that is checked by the regexp statement
  const regx = new RegExp(/^\w+\=+\w+$/)
  if (key === 'specs') {
    if (!value.split('\n').every(spec => regx.test(spec))) {
      return { 'errorMessage': 'The format of the specs field is incorrect' }
    }
    else return false
  }
  if (key === "stock") {
    if (isNaN(Number(value))) return { 'errorMessage': 'The stock should be a number' }
    if (value < 0) return { 'errorMessage': 'The stock should be minimum 0' }
    return false
  }
  if (key === "warning_at") {
    if (isNaN(Number(value))) return { 'errorMessage': 'The Warning At field should be a number' }
    if (value < 0) return { 'errorMessage': 'The Warning At field should be minimum 0' }
    return false
  }
  return false
}


function checkOrGenerateSku(sku, name) {
  if (!name) return sku
  if (!sku) return sku = name.split(' ').map(string => string.replace(/[^a-z0-9]/gi, '')[0]).join('').slice(0, 12)
  if (sku) return sku = sku.replace(/[^a-z0-9]/gi, '').slice(0, 12)
}

