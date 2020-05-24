module.exports = class ProductsRepositroy {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  async insertNewProduct(newProduct, images) {
    const insertProduct = `INSERT INTO 
                            products 
                              (
                                sku, 
                                name, 
                                price, 
                                description, 
                                specs,
                                stock,
                                warning_at
                              ) 
                            VALUES 
                              (?,?,?,?,?,?,?)`

    const insertImage = `INSERT INTO
                           images
                            (
                              product_sku, 
                              path, 
                              isPrimaryImage
                            ) 
                            VALUES
                              (?,?,?)`

    const findSkuByLastID = `SELECT
                              sku
                            FROM
                              products
                            WHERE
                              id = ?`
    try {
      const lastID = await this.dbAdapter.run(insertProduct, [newProduct.sku, newProduct.name, newProduct.price, newProduct.description, newProduct.specs, newProduct.stock, newProduct.warning_at])
      const lastSku = await this.dbAdapter.get(findSkuByLastID, [lastID])

      if (images && lastSku) {
        await Promise.all(images.map(image => this.dbAdapter.run(insertImage, [lastSku.sku, image.path, image.isPrimaryImage])))
      }
    } catch (error) {
      console.log(error)
    }
  }


  async findProducts() {
    const findProducts = `SELECT
                              products.id, 
                              products.sku, 
                              products.name, 
                              products.price, 
                              products.stock,
                              products.warning_at,
                              images.path  
                            FROM 
                              products
                            LEFT JOIN
                              images ON products.sku = images.product_sku
                            WHERE
                              isPrimaryImage = 1`

    try {
      const products = await this.dbAdapter.all(findProducts)
      return products
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async findProductBySku(sku) {
    const findProductBySku = `SELECT
                              products.id,
                              products.sku,
                              products.name,
                              products.price,
                              products.description,
                              products.specs,
                              products.stock,
                              products.warning_at,
                              images.id,
                              images.path,
                              images.isPrimaryImage
                            FROM
                              products
                            LEFT JOIN
                              images ON products.sku = images.product_sku
                            WHERE
                              products.sku = ?`

    try {
      const product = await this.dbAdapter.all(findProductBySku, [sku])
      return product
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async updateProduct(product, sku) {
    console.log(product, sku)
    const updateProduct = `UPDATE 
                              products 
                            SET 
                              name = ?, 
                              price =?, 
                              description = ?, 
                              specs = ?,
                              stock = ?,
                              warning_at = ?
                            WHERE 
                              sku = ?`
    try {
      
      await this.dbAdapter.run(updateProduct, [product.name, product.price, product.description, product.specs, product.stock, product.warning_at, sku])
    } catch (error) {
      console.log(error)
    }
  }

  async updatePrimaryImage(id) {
    const updatePreviousPrimaryImage = `UPDATE
                                          images
                                        SET
                                          isPrimaryImage = ?
                                        WHERE
                                          isPrimaryImage = 1
                                        AND
                                           product_sku = ?`

    const setNewPrimaryImage = `UPDATE
                                  images
                                SET
                                  isPrimaryImage = ?
                                WHERE
                                  id = ?`


    try {
      const productSku = await this.findProductSkuOfImage(id)
      if (productSku) {
        await this.dbAdapter.run(updatePreviousPrimaryImage, [0, productSku])
        await this.dbAdapter.run(setNewPrimaryImage, [1, id])
        const images = await this.findAllImagesOfProduct(productSku)
        return images
      }

    } catch (error) {
      return error
    }
  }


  async deleteImage(id) {
    const deleteImage = `DELETE FROM
                            images
                          WHERE
                            id = ?`

    try {
      const isItPrimaryImg = await this.checkIfItIsPrimaryImage(id)
      const productSku = await this.findProductSkuOfImage(id)
      if (isItPrimaryImg === undefined || isItPrimaryImg === 1) {
        return await this.findAllImagesOfProduct(productSku)
      }

      await this.dbAdapter.run(deleteImage, [id])
      const images = await this.findAllImagesOfProduct(productSku)
      return images
    } catch (error) {
      return error
    }
  }



  async findProductSkuOfImage(id) {
    const findProductSkuOfImage = `SELECT
                                    product_sku
                                  FROM
                                    images
                                  WHERE
                                    id = ?`
    try {
      const productSku = await this.dbAdapter.get(findProductSkuOfImage, [id])
      return productSku ? productSku.product_sku : productSku
    } catch (error) {
      return error
    }
  }


  async findAllImagesOfProduct(productSku) {
    const findAllImages = `SELECT
                              id,
                              path,
                              isPrimaryImage
                            FROM
                              images
                            WHERE
                              product_sku = ?`

    try {
      const images = await this.dbAdapter.all(findAllImages, [productSku])
      return images
    } catch (error) {
      return error
    }
  }

  async checkIfItIsPrimaryImage(picId) {
    const findImage = `SELECT
                        isPrimaryImage
                      FROM
                        images
                      WHERE
                        id = ?`
    try {
      const isItPrimary = await this.dbAdapter.get(findImage, [picId])
      return isItPrimary ? isItPrimary.isPrimaryImage : isItPrimary
    } catch (error) {
      console.log(error)
    }
  }

  async isSkuExists(sku) {
    const findSku = `SELECT
                        sku
                      FROM
                        products
                      WHERE
                        sku = ?`
    try {
      const isSkuExists = await this.dbAdapter.get(findSku, [sku])
      return isSkuExists ? isSkuExists.sku : isSkuExists
    } catch (error) {
      console.log(error)
    }
  }

  async isPrimaryImgExists(sku) {
    const isExist = `SELECT
                      isPrimaryImage
                    FROM
                      images
                    WHERE
                      product_sku = ?
                    AND
                      isPrimaryImage = ?`
    try {
      const isPrimaryImgExists = await this.dbAdapter.get(isExist, [sku, 1])
      return isPrimaryImgExists ? isPrimaryImgExists.isPrimaryImage : isPrimaryImgExists
    } catch (error) {
      console.log(error)
    }
  }

  async addNewImagesToSku(images, sku) {
    const insertNewImage = `INSERT INTO
                              images
                                (
                                  product_sku, 
                                  path, 
                                  isPrimaryImage
                                )
                            VALUES
                              (?,?,?)`
    try {
      if (images) {
        await Promise.all(images.map(image => this.dbAdapter.run(insertNewImage, [sku, image.path, image.isPrimaryImage])))
      }
      return await this.findAllImagesOfProduct(sku)
    } catch (error) {
      console.log(error)
    }
    
  }

  async findPathOfPicId(id) {
    const findPath = `SELECT
                        path
                      FROM
                        images
                      WHERE
                        id = ?`
    try {
      const path = await this.dbAdapter.get(findPath, [id])
      return path ? path.path : path
    } catch (error) {
      console.log(error)
    }
  }

  async getSkus() {
    const findSkus = `SELECT
                        sku,
                        name
                      FROM
                        products`
    try {
      const skus = await this.dbAdapter.all(findSkus)
      return skus ? skus : []
    } catch (error) {
      console.log(error)
    }
  }

  async addNewOffer(marketingtext, sku, imagePath) {
    console.log(marketingtext, sku, imagePath)
    const addNewOffer = `INSERT INTO
                          offers
                            (
                              product_sku,
                              marketingText,
                              imagePath
                            )
                          VALUES
                              (?,?,?)`
    try {
      await this.dbAdapter.run(addNewOffer, [sku, marketingtext, imagePath])
    } catch (error) {
      console.log(error)
    }
  }

  async findOffers() {
    const findOffers = `SELECT
                          id,
                          product_sku,
                          marketingText,
                          imagePath
                        FROM
                          offers`
    try {
      const offers = await this.dbAdapter.all(findOffers)
      return offers
    } catch (error) {
      console.log(error)
    }
  }

  async delOffer(offerId) {
    const deleteOffer = `DELETE FROM
                            offers
                          WHERE
                            id = ?`
    try {
      await this.dbAdapter.run(deleteOffer, [offerId])
    } catch (error) {
      console.log(error)
    }
  }


  async updateRecommendations(sku, recommendations) {
    const deleteRecommendationsOfProduct = `DELETE FROM
                                              recommendations
                                            WHERE
                                              product_sku = ?`

    const addNewRecommendations = `INSERT INTO
                                      recommendations
                                        (
                                          product_sku,
                                          recommended_sku
                                        )
                                      VALUES
                                        (?,?)`

      try {
        await this.dbAdapter.run(deleteRecommendationsOfProduct, [sku])
        if (recommendations) {
          await Promise.all(recommendations.map(recommendation => this.dbAdapter.run(addNewRecommendations, [sku, recommendation])))
        }
      } catch (error) {
        console.log(error)
      }
  }

  async findProductDetailsToClients() {
    const findProducts = `SELECT
                              products.sku, 
                              products.name, 
                              products.price, 
                              products.stock,
                              products.description,
                              products.specs,
                              group_concat(DISTINCT images.path || ';' || images.isPrimaryImage ) AS images,  
                              group_concat(DISTINCT recommendations.recommended_sku) AS recommendations
                            FROM 
                              products
                            LEFT JOIN
                              images ON products.sku = images.product_sku
                            LEFT JOIN
                              recommendations ON products.sku = recommendations.product_sku
                            GROUP BY
                              products.sku                              
                            `
    try {
      const products = await this.dbAdapter.all(findProducts)
      return products
    } catch (error) {
      console.log(error)
    }
  }

  

}