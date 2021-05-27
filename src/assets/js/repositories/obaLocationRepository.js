/**
 *
 * @author Nazlıcan Eren
 */

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

    async getChosenWeek(location, chosenYear, chosenWeek) {
        return await networkManager
            .doRequest(`${this.route}/chosenWeek?location=${location}&year=${chosenYear}&week=${chosenWeek}`,
                null, "GET");
    }

    async getChosenMonth(location, chosenYear, chosenMonth) {
        return await networkManager
            .doRequest(`${this.route}/chosenMonth?location=${location}&year=${chosenYear}&month=${chosenMonth}`,
                null, "GET");

    }

    async getFirstQuarter(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/firstQuarter?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    async getSecondQuarter(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/secondQuarter?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    async getThirdQuarter(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/thirdQuarter?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    async getFourthQuarter(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/fourthQuarter?location=${location}&year=${chosenYear}`,
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

    async getAllQuarterOfAYear() {
        return await networkManager
            .doRequest(`${this.route}/allQuarterOfAYear`, null, "GET");
    }

    async getAllMonthsOfAYear() {
        return await networkManager
            .doRequest(`${this.route}/allMonthsOfAYear`, null, "GET");
    }

    async getDataOfMonth(location, year, month) {
        return await networkManager
            .doRequest(`${this.route}/dataOfMonth?location=${location}&year=${year}&month=${month}`,
                null, "GET");
    }

    async getAllWeeksOfAYear(location, year) {
        return await networkManager
            .doRequest(`${this.route}/allWeeksOfAYear?location=${location}&year=${year}`,
                null, "GET");
    }


}
