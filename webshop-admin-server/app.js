const express = require('express');
const cors = require('cors')


const DBAdapter = require('./adapter/sqlite3-adapter')
const ProductsRepositroy = require('./repository/products-repository')
const OrdersRepositroy = require('./repository/orders-repository')
const ProductsService = require('./service/products-service')
const OrdersService = require('./service/orders-service')
const ProductsController = require('./controller/products-controller')
const OrdersController = require('./controller/orders-controller')

const app = express();
app.use(cors())
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))



const productsController = new ProductsController( new ProductsService( new ProductsRepositroy( new DBAdapter ) ) )
const ordersController = new OrdersController( new OrdersService( new OrdersRepositroy( new DBAdapter ) ) )


app.post('/product', productsController.insertNewProduct.bind(productsController))
app.get('/products', productsController.findProducts.bind(productsController))
app.get('/products/:sku', productsController.findProductBySku.bind(productsController))
app.put('/updateProduct/:sku', productsController.updateProduct.bind(productsController))
app.put('/files/:id', productsController.updatePrimaryImage.bind(productsController))
app.delete('/files/:id', productsController.deleteImage.bind(productsController))
app.post('/products/:sku/files', productsController.addNewImages.bind(productsController))

app.get('/getSkus', productsController.getSkus.bind(productsController))
app.post('/createOffer', productsController.createOffer.bind(productsController))
app.get('/findOffers', productsController.findOffers.bind(productsController))
app.delete('/offer/:id/:imagePath', productsController.deleteOffer.bind(productsController))

app.post('/recommendations/:sku', productsController.updateRecommendations.bind(productsController))

app.get('/productsToClients', productsController.findProductDetailsToClients.bind(productsController))

app.post('/checkout', ordersController.saveOrder.bind(ordersController))
app.get('/findOrders', ordersController.findOrders.bind(ordersController))




app.listen(port, () => console.log(`Example app listening on port ${port}!`));