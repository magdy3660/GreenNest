const getDb = require('../util/database').getDb
 class Scan {
    constructor(user_id, plantId, scanDate, scanResult) {
        this.user_id = user_id;
        this.plantId = plantId;
        this.scanDate = scanDate;
        this.scanResult = scanResult;
    }
save() {
    const db = getDb()
    try {
    db.collection('scans').insertOne(this).then(result => {
        console.log(result)
    })
    }
    catch(err) {
        console.log(err)
    }
}
static fetchAll() {

}


}

module.exports = History