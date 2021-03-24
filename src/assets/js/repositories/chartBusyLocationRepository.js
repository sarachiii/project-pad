class chartBusyLocationRepository {

    constructor() {
        this.route = "/location"
    }

    async get() {
        return await networkManager
            .doRequest(`${this.route}`, null, "GET");
    }
}
