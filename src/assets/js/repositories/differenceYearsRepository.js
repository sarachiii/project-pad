class DifferenceYearsRepository {

    constructor() {
        this.route = "/percentageYear"
    }

    async getdifferenceyears() {
        return await networkManager
            .doRequest(`${this.route}`, null, "GET");
    }
}
