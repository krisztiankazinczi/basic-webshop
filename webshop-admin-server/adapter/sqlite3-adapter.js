const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./products.db')



module.exports = class DbAdapter {

  get(sqlString, params) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get(sqlString, params, (err, result) => {
          if (err) {
            console.log(err)
            reject(err);
            return
          }
          resolve(result)
        })
      })
    })
  }

  all(sqlString, params) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(sqlString, params, (err, results) => {
          if (err) {
            reject(err);
            return
          }
          resolve(results)
        })
      })
    })
  }


  run(sqlString, params) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(sqlString, params, function (err) {
          if (err) {
            reject(err);
            return
          }
          resolve(this.lastID)
        })
      })
    })
  }






}
