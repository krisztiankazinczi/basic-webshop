module.exports = class OrdersRepository {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
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


  async save(name, email, address, cart) {
    const saveOrder = `INSERT INTO
                          orders
                            (
                              name, 
                              email, 
                              address
                            ) 
                          VALUES
                            (?,?,?)`

    const saveOrderItems = `INSERT INTO
                              order_items
                            (
                              order_id,
                              product_sku,
                              pieces
                            )
                            VALUES
                              (?,?,?)`

    try {
      const orderID = await this.dbAdapter.run(saveOrder, [name, email, address])
      await Promise.all(cart.map(item => this.dbAdapter.run(saveOrderItems, [orderID, item.sku, item.pieces])))

    } catch (error) {
      console.log(error)
    }
  }

  async findOrders() {
    const findOrders = `SELECT
                          orders.name,
                          orders.address,
                          orders.email,
                          group_concat(order_items.pieces || ',' || products.name || ',' || products.price || ',' || order_items.product_sku) AS orderItems
                        FROM
                          orders
                        LEFT JOIN
                          order_items ON orders.id = order_items.order_id
                        LEFT JOIN
                          products ON products.sku = order_items.product_sku
                        GROUP BY orders.name`
    try {
      const orders = await this.dbAdapter.all(findOrders)
      return orders
    } catch (error) {
      console.log(error)
    }
  }


}