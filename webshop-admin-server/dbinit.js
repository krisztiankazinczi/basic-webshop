const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./products.db')


db.serialize(function () {
    // db.run("DROP TABLE products");
    // db.run("DROP TABLE images");
    db.run("DROP TABLE orders");
    db.run("DROP TABLE order_items");
    // db.run("DROP TABLE offers");
    // db.run("DROP TABLE recommendations");
})

db.serialize(function () {
    // db.run(`CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, sku VARCHAR(12) NOT NULL,
    //  name VARCHAR(60) NOT NULL, price INTEGER NOT NULL, description VARCHAR(240) NOT NULL, specs TEXT NOT NULL, stock INTEGER, warning_at INTEGER);`);

    // db.run(`CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY AUTOINCREMENT,
    //    product_sku NOT NULL, path TEXT NOT NULL, isPrimaryImage INTEGER, FOREIGN KEY (product_sku) REFERENCES products (sku))`)

    // db.run(`CREATE TABLE IF NOT EXISTS offers(id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   product_sku NOT NULL, marketingText TEXT NOT NULL, imagePath TEXT NOT NULL, FOREIGN KEY (product_sku) REFERENCES products (sku))`)

    // db.run(`CREATE TABLE IF NOT EXISTS recommendations(id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   product_sku NOT NULL, recommended_sku NOT NULL, FOREIGN KEY (product_sku) REFERENCES products (sku))`)
    
    db.run('CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(60) NOT NULL, email VARCHAR(60) NOT NULL, address VARCHAR(100) NOT NULL)')
    db.run(`CREATE TABLE IF NOT EXISTS order_items(id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_sku VARCHAR(20) NOT NULL, pieces INTEGER NOT NULL, FOREIGN KEY (product_sku) REFERENCES products (sku), FOREIGN KEY (order_id) REFERENCES orders (id) )`)

  })

