const trackedPlants = [];
module.exports = class trackedPlant {
    constructor(id, name, image, health, scanHistory) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.health = health;
        this.scanHistory = scanHistory;
    }
     save () {
 

    }
    static remove(id) {
    // plantId = findone    
    
    }

static fetchAll() {
    // get all tracked plants
}
}
