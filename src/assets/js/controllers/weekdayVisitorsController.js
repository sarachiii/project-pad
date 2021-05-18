class WeekdayVisitorsController {
    constructor() {
        this.weekdayVisitorsRepository = new weekdayVisitorsRepository();

        $.get("views/weekdayVisitors.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the weekdayVisitors.html has been loaded
    setup(data) {
        //Load content into memory
        this.weekdayVisitorsView = $(data);

        //Change colour of navbar item
        $(".nav-item").removeClass("active");
        $(".weekdayVisitorsItem").addClass("active");

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.weekdayVisitorsView);
        this.getOptions()
    }

    async getOptions() {

        let promiseYear = await this.weekdayVisitorsRepository.getyearOptions()
        let promiseLocation = await this.weekdayVisitorsRepository.getlocationOptions()

        let yearOptions = [];
        let locationOptions = [];


        for (let i = 0; i < promiseYear.length; i++) {
            yearOptions[i] = promiseYear[i].year
        }

        for (let i = 0; i < promiseLocation.length; i++) {
            locationOptions[i] = promiseLocation[i].location
        }


        var selectLocation = document.getElementById('locationOptions');
        var selectYear = document.getElementById('yearOptions');

        for (let i = 0; i < yearOptions.length; i++) {
            var option = document.createElement('option');
            option.value = yearOptions[i];
            option.innerHTML = yearOptions[i];
            selectYear.appendChild(option);
        }

        for (let i = 0; i < locationOptions.length; i++) {
            option = document.createElement('option');
            option.value = locationOptions[i];
            option.innerHTML = locationOptions[i];
            selectLocation.appendChild(option);
        }


        document.getElementById("buildChart").onclick = async function() {

            this.weekdayVisitorsRepository1 = new weekdayVisitorsRepository();

            const year = document.getElementById("yearOptions").value;
            const location =  document.getElementById("locationOptions").value;


            let chartpromise = await this.weekdayVisitorsRepository1.getWeekdayData(year, location)
            console.log(chartpromise);
        };
    }



}