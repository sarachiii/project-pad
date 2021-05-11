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

    async getChosenMonth(location, chosenYear, chosenMonth) {
        return await networkManager
            .doRequest(`${this.route}/chosenMonth?location=${location}&year=${chosenYear}&month=${chosenMonth}`,
                null, "GET");

    }

    async getChosenYear(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/chosenYear?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    async getAllDate() {
        return await networkManager
            .doRequest(`${this.route}/allDate`, null, "GET");
    }

    async getAllYears(location) {
        return await networkManager
            .doRequest(`${this.route}/allYears?location=${location}`, null, "GET");
    }

    async getAllMonthsOfAYear() {
        return await networkManager
            .doRequest(`${this.route}/allMonthsOfAYear`, null, "GET");
    }

    async getAllMonths(location, year, month) {
        return await networkManager
    .doRequest(`${this.route}/allMonths?location=${location}&year=${year}&month=${month}`,
            null, "GET");
    }


}
