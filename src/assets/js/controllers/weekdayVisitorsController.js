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


        $("#buildChart").click(async function () {

            let maandag;
            let dinsdag;
            let woensdag;
            let donderdag;
            let vrijdag;
            let zaterdag;
            let zondag;

            let weekDayVisitorsRepository = new weekdayVisitorsRepository();

            const year = document.getElementById("yearOptions").value;
            const location = document.getElementById("locationOptions").value;

            let chartPromise = await weekDayVisitorsRepository.getWeekdayData(year, location)

                maandag = Math.round(chartPromise[0].average);
            dinsdag = Math.round(chartPromise[1].average);
            woensdag = Math.round(chartPromise[2].average);
            donderdag = Math.round(chartPromise[3].average);
            vrijdag = Math.round(chartPromise[4].average);
            zaterdag = Math.round(chartPromise[5].average);
            zondag = Math.round(chartPromise[6].average);





            console.log("maandag: " + maandag);
            console.log("dinsdag: " + dinsdag);
            console.log("woensdag: " + woensdag);
            console.log("donderdag: " + donderdag);
            console.log("vrijdag: " + vrijdag);
            console.log("zaterdag: " + zaterdag);
            console.log("zondag: " + zondag);
            return false

        });

        // document.getElementsByClassName("buildChart").onclick = async function() {
        //
        //     const year = document.getElementById("yearOptions").value;
        //     const location =  document.getElementById("locationOptions").value;
        //
        //
        //     let chartpromise = await this.
        //     console.log(chartpromise);
        //
        // };


    }


}