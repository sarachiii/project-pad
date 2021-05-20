class BusyDistrictRepository {

    constructor() {
        this.route = "/busyDistrict"
    }

    async getDistricts() {
        return await networkManager
            .doRequest(`${this.route}`, null, "GET");
    }
}
