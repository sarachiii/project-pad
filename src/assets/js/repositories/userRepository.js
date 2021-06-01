/**
 * Repository responsible for all user data from server - CRUD
 *
 */
class UserRepository {

    constructor() {
        this.route = "/user"
    }

    /**
     * async function that handles a Promise from the networkmanager
     * @param username
     * @param password
     * @returns {Promise<user>}
     */
    async login(username, password) {
        return await networkManager
            .doRequest(`${this.route}/login`, {"username": username, "password": password}, "POST");
    }

}