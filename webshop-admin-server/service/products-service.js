module.exports = class ProductsService {
  constructor(productsRepository) {
    this.productsRepository = productsRepository
  }

  insertNewProduct(newProduct, images) {
      return this.productsRepository.insertNewProduct(newProduct, images)

  }

  findProducts() {
      const products = this.productsRepository.findProducts()
      return products
  }

  async findProductBySku(sku) {
    try {
      let product = await this.productsRepository.findProductBySku(sku)
      product = createProduct(product)
      return product
    } catch (error) {
        console.log(error)
    }
  }

  updateProduct(product, sku) {
     return this.productsRepository.updateProduct(product, sku)
  }

  updatePrimaryImage(id) {
      return this.productsRepository.updatePrimaryImage(id)
  }

  deleteImage(id) {
      return this.productsRepository.deleteImage(id)
  }

  findPathOfPicId(id) {
    return this.productsRepository.findPathOfPicId(id)
  }

  isSkuExists(sku) {
    return this.productsRepository.isSkuExists(sku)
  }

  isPrimaryImgExists(sku) {
    return this.productsRepository.isPrimaryImgExists(sku)
  }

  addNewImagesToSku(imagesPath, sku) {
    return this.productsRepository.addNewImagesToSku(imagesPath, sku)
  }

  getSkus() {
    return this.productsRepository.getSkus()
  }

  addNewOffer(marketingtext, sku, imagePath) {
    return this.productsRepository.addNewOffer(marketingtext, sku, imagePath)
  }

  findOffers() {
    return this.productsRepository.findOffers()
  }

  delOffer(offerId) {
    return this.productsRepository.delOffer(offerId)
  }

  updateRecommendations(sku, recommendations) {
    return this.productsRepository.updateRecommendations(sku, recommendations)
  }

  async findProductDetailsToClients() {
    try {
      const products = await this.productsRepository.findProductDetailsToClients()
      const finalFormOfProducts = createAppropriateClientData(products)
      const offers = await this.productsRepository.findOffers()
      const finalFormOfOffers = createOffersToClient(offers)
      return {products: finalFormOfProducts, offers: finalFormOfOffers}
    } catch (error) {
    }
  }
}




function createProduct(products) {
  const finalProduct = products[0]
  finalProduct.files = []

  for (let i = 0; i < products.length; i++) {
    finalProduct.files.push({id: products[i]['id'], path: products[i]['path'], isPrimaryImage: products[i]['isPrimaryImage']}) 
  }
  return finalProduct
}

function createAppropriateClientData(products) {
  const updatedProduct = products.map(product => {
    return {
      ...product,
      images: product.images.split(",").map(image => {
        const data = image.split(";")
        return {path: `http://localhost:5000/${data[0]}`, isPrimary: parseInt(data[1]) ? true : false}
      }),
      recommendations: product.recommendations.split(',')
    }
  })

  return updatedProduct

}

function createOffersToClient(offers) {
  const updatedOffers = offers.map(offer => {
    return {
      ...offer,
      imagePath: `http://localhost:5000/offers/${offer.imagePath}`,
    }
  })
  return updatedOffers
}


