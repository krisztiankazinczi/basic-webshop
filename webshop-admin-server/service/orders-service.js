module.exports = class OrdersService {
  constructor(ordersRepository) {
    this.ordersRepository = ordersRepository
  }

  isSkuExists(sku) {
    return this.ordersRepository.isSkuExists(sku)
  }

  save(name, email, address, cart) {
    return this.ordersRepository.save(name, email, address, cart)
  }


  async findOrders() {
    try {
      const orders = await this.ordersRepository.findOrders()
      console.log(orders)
    } catch (error) {
      console.log(error)
    }
     
  }
}