class BusyLocationRepository {

    constructor() {
        this.route = "/location"
    }

    async getLocations() {
        return await networkManager
            .doRequest(`${this.route}`, null, "GET");
    }
}
