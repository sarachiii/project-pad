class DashboardRepository {

    constructor() {
        this.route = "/featured"
    }

    async getAll() {
        return await networkManager
            .doRequest(`${this.route}/all`, null, "GET");
    }

    async getFeatured() {
        return await networkManager
            .doRequest(`${this.route}`, null, "GET");
    }
}
