/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 *
 * Available: `sessionManager` or `networkManager` or `app.loadController(..)`
 *
 * You only want one instance of this class, therefor always use `app`.
 *
 * @author Lennard Fonteijn & Pim Meijer
 */
const CONTROLLER_SIDEBAR = "sidebar";
const CONTROLLER_LOGIN = "login";
const CONTROLLER_LOGOUT = "logout";
const CONTROLLER_WELCOME = "welcome";
const CONTROLLER_DASHBOARD = "dashboard";
const CONTROLLER_BUSYLOCATION = "location";
const CONTROLLER_SEARCHBOOKS = "books";
const CONTROLLER_UPLOADXML = "uploadXML";
const CONTROLLER_OBALOCATION = "obaLocation";
const CONTROLLER_VISITORYEAR = "visitoryear";
const CONTROLLER_WEEKDAYVISITORS = "weekdayVisitors"


const sessionManager = new SessionManager();
const networkManager = new NetworkManager();

class App {

    init() {
        //Always load the sidebar
        this.loadController(CONTROLLER_SIDEBAR);

        //Attempt to load the controller from the URL, if it fails, fall back to the welcome controller.
        this.loadControllerFromUrl(CONTROLLER_WELCOME);
    }

    /**
     * Loads a controller
     * @param name - name of controller - see constants
     * @param controllerData - data to pass from on controller to another
     * @returns {boolean} - successful controller change
     */
    loadController(name, controllerData) {

        if (controllerData) {
            console.log(controllerData);
        } else {
            controllerData = {};
        }

        switch (name) {
            case CONTROLLER_SIDEBAR:
                new NavbarController();
                break;

            case CONTROLLER_LOGIN:
                this.setCurrentController(name);
                this.isLoggedIn(() => new WelcomeController(), () => new LoginController());
                break;

            case CONTROLLER_WELCOME:
                this.setCurrentController(name);
                this.isLoggedIn(() => new WelcomeController, () => new LoginController());
                break;

            case CONTROLLER_LOGOUT:
                this.setCurrentController(name);
                this.handleLogout();
                break;

            case CONTROLLER_DASHBOARD:
                this.setCurrentController(name);
                this.isLoggedIn(() => new DashboardController(), () => new LoginController());
                break;

            case CONTROLLER_BUSYLOCATION:
                this.setCurrentController(name);
                this.isLoggedIn(() => new BusyLocationController(), () => new LoginController());
                break;

            case CONTROLLER_VISITORYEAR:
                this.setCurrentController(name);
                this.isLoggedIn(() => new VisitorYearController(), () => new LoginController());
                break;

            case CONTROLLER_SEARCHBOOKS:
                this.setCurrentController(name);
                this.isLoggedIn(() => new BooksController(), () => new LoginController());
                break;

            case CONTROLLER_OBALOCATION:
                this.setCurrentController(name);
                this.isLoggedIn(() => new ObaLocationController(), () => new LoginController());
                break;

            case CONTROLLER_UPLOADXML:
                this.setCurrentController(name);
                this.isLoggedIn(() => new UploadXMLController(), () => new LoginController());
                break;

            case CONTROLLER_WEEKDAYVISITORS:
                this.setCurrentController(name);
                this.isLoggedIn(() => new WeekdayVisitorsController(), () => new LoginController());
                break;

            default:
                return false;
        }

        return true;
    }

    /**
     * Alternative way of loading controller by url
     * @param fallbackController
     */
    loadControllerFromUrl(fallbackController) {
        const currentController = this.getCurrentController();

        if (currentController) {
            if (!this.loadController(currentController)) {
                this.loadController(fallbackController);
            }
        } else {
            this.loadController(fallbackController);
        }
    }

    getCurrentController() {
        return location.hash.slice(1);
    }

    setCurrentController(name) {
        location.hash = name;
    }

    /**
     * Convenience functions to handle logged-in states
     * @param whenYes - function to execute when user is logged in
     * @param whenNo - function to execute when user is logged in
     */
    isLoggedIn(whenYes, whenNo) {
        if (sessionManager.get("username")) {
            whenYes();
        } else {
            whenNo();
        }
    }

    /**
     * Removes username via sessionManager and loads the login screen
     */
    handleLogout() {
        sessionManager.remove("username");

        //go to login screen
        this.loadController(CONTROLLER_LOGIN);
    }
}

const app = new App();

//When the DOM is ready, kick off our application.
$(function () {
    app.init();
});