class VisitorYearRepository {

    constructor() {
        this.route = "/visitoryear"
    }

    async getYearData() {
        return await networkManager
            .doRequest(`${this.route}`, null, "GET");
    }
}
