module.exports = class OrdersController {
  constructor(ordersService) {
    this.ordersService = ordersService
  }

  async saveOrder(req, res) {
    const { name, email, address, cart } = req.body;

    console.log(name, email, address, cart)

    const validated = validate({name, email, address})

    if (!validated) {
      res.json(validated)
      return
    }

    const badSkus = ""

    try {
      cart.forEach(async (item) => {
        const isSkuExists = await this.ordersService.isSkuExists(item.sku)
        console.log(isSkuExists)
        if (!isSkuExists) {
          badSkus += `${item.sku} is not existing. `
        }
      })
    } catch (error) {
      res.json({ error: 'We are sorry, something went wrong. Please try again later' })
      return
    }

    if (badSkus) {
      res.json({ skuError: badSkus })
      return
    }

    try {
      await this.ordersService.save(name, email, address, cart)
      res.json({})
      return
    } catch (error) {
      res.json({error: 'We are sorry, something went wrong, please try it again later'})
    }

    
  }



  async findOrders(req, res) {
    try {
      const orders = await this.ordersService.findOrders()
      res.json({orders})
    } catch (error) {
      console.log(error)
    }
  }

}




function validate(validationValues) {
  let errorObject = {}
  for (let [key, value] of Object.entries(validationValues)) {

    if (!value) {
      errorObject[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required!`
    } 
    else {
      const result = checkLength(key, value)
      if (result) {
        errorObject[key] = result.errorMessage
      } 
    }
  }
  return errorObject;
}

function checkLength(key, value) {
    if (value.length < 5) {
      return { 'errorMessage': `${key.charAt(0).toUpperCase() + key.slice(1)} is too short!` }
    } 
    return false
}