class weekdayVisitorsRepository {

    constructor() {
        this.route = "/weekdayVisitors"
    }

    async getyearOptions(){
        return await networkManager
            .doRequest(`${this.route + "/yearOptions"}`, null, "GET");
    }

    async getlocationOptions(){
        return await networkManager
            .doRequest(`${this.route + "/locationOptions"}`, null, "GET");
    }


    async getWeekdayData(year, location) {
        return await networkManager
            .doRequest(`${this.route}?year=${year}&location=${location}`, null, "GET");
    }
}
