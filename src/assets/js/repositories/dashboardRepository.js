/**
 * -- THIS IS AN EXAMPLE REPOSITORY WITH EXAMPLE DATA FROM DB --
 * Repository responsible for all room related data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with `networkManager`!
 *
 * @author Pim Meijer
 */
class dashboardRepository {

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
