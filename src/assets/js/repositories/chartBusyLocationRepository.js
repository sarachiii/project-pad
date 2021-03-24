class chartBusyLocationRepository {

    constructor() {
        this.route = "/location"
    }

    async getAll() {
        return await networkManager
            .doRequest(`${this.route}`, null, "GET");
    }
}
