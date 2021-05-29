/**
 * Repository obaLocations
 *
 * @author Nazlıcan Eren
 */

class ObaLocationRepository {

    constructor() {
        this.route = "/location"
    }

    //Gets all districts
    async getDistricts() {
        return await networkManager
            .doRequest(`${this.route}/districts`, null, "GET");
    }

    //Gets all locations of a district
    async getAllLocations(district) {
        return await networkManager
            .doRequest(`${this.route}/all?district=${district}`, null, "GET");

    }

    //Gets visitors data of a chosen week, year and location
    async getChosenWeek(location, chosenYear, chosenWeek) {
        return await networkManager
            .doRequest(`${this.route}/chosenWeek?location=${location}&year=${chosenYear}&week=${chosenWeek}`,
                null, "GET");
    }

    //Gets visitor data of a chosen month, year and location
    async getChosenMonth(location, chosenYear, chosenMonth) {
        return await networkManager
            .doRequest(`${this.route}/chosenMonth?location=${location}&year=${chosenYear}&month=${chosenMonth}`,
                null, "GET");

    }

    //Gets visitor data of the first quarter of a year and location when chosen
    async getFirstQuarter(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/firstQuarter?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    //Gets visitor data of the second quarter of a year and location when chosen
    async getSecondQuarter(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/secondQuarter?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    //Gets visitor data of the third quarter of a year and location when chosen
    async getThirdQuarter(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/thirdQuarter?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    //Gets visitor data of the fourth quarter of a year and location when chosen
    async getFourthQuarter(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/fourthQuarter?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    //Gets visitor data of a chosen year and location
    async getChosenYear(location, chosenYear) {
        return await networkManager
            .doRequest(`${this.route}/chosenYear?location=${location}&year=${chosenYear}`,
                null, "GET");
    }

    //Gets all date options
    async getAllDate() {
        return await networkManager
            .doRequest(`${this.route}/allDate`, null, "GET");
    }

    //Get all visitor data years of a location
    async getAllYears(location) {
        return await networkManager
            .doRequest(`${this.route}/allYears?location=${location}`, null, "GET");
    }

    //Gets all quarters
    async getAllQuarterOfAYear() {
        return await networkManager
            .doRequest(`${this.route}/allQuarterOfAYear`, null, "GET");
    }

    //Gets all months of a year
    async getAllMonthsOfAYear() {
        return await networkManager
            .doRequest(`${this.route}/allMonthsOfAYear`, null, "GET");
    }

    //Gets visitor data of all months a year of a location
    async getDataOfMonth(location, year, month) {
        return await networkManager
            .doRequest(`${this.route}/dataOfMonth?location=${location}&year=${year}&month=${month}`,
                null, "GET");
    }

    //Gets all visitor data of all weeks a year of a location
    async getAllWeeksOfAYear(location, year) {
        return await networkManager
            .doRequest(`${this.route}/allWeeksOfAYear?location=${location}&year=${year}`,
                null, "GET");
    }
}
