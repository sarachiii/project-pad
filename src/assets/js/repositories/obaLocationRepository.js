class ObaLocationRepository {

    constructor() {
        this.route = "/location"
    }

    async getDistricts() {
        return await networkManager
            .doRequest(`${this.route}/districts`, null, "GET");
    }

    async getAllLocations(district) {
        return await networkManager
            .doRequest(`${this.route}/all?q=${district}`, null, "GET");

    }
}
