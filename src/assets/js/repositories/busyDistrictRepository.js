class BusyDistrictRepository {

    constructor() {
        this.route = "/busyDistrict"
    }

    async getDistricts() {
        return await networkManager
            .doRequest(`${this.route}`, null, "GET");
    }

    async getMonths(){
        return await networkManager
            .doRequest(`${this.route + "/months"}`, null, "GET");
    }
}
