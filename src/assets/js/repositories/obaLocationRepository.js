class ObaLocationRepository {

    constructor() {
        this.route = "/location"
    }

    async getDistricts() {
        return await networkManager
            .doRequest(`${this.route}/districts`, null, "GET");
    }

    async getAllLocations(district) {
        return await networkManager
            .doRequest(`${this.route}/all?district=${district}`, null, "GET");

    }

    async getChosenWeek(location, chosenWeek, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/chosenWeek?location=${location}&week=${chosenWeek}&year=${chosenYear}`,
                null, "GET");
    }

    async getChosenYear(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/chosenYear?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    async getAllDate() {
        return await networkManager
            .doRequest(`${this.route}/getAllDate`, null, "GET");
    }

    async getAllYears(location) {
        return await networkManager
            .doRequest(`${this.route}/getAllYears?location=${location}`, null, "GET");
    }

    async getAllMonths() {
        return await networkManager
            .doRequest(`${this.route}/getAllMonths`, null, "GET");
    }


}
