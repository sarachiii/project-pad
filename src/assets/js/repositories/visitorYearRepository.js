class VisitorYearRepository {

    constructor() {
        this.route = "/visitoryear"
    }

    async getYearData() {
        return await networkManager
            .doRequest(`${this.route}`, null, "GET");
    }

    async getAllLocations(){
        return await networkManager
            .doRequest(`${this.route}/allLocations`, null, "GET");
    }
}
