/**
 * Server application - contains all server config and api endpoints
 *
 * @author Pim Meijer
 */
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./utils/databaseHelper");
const cryptoHelper = require("./utils/cryptoHelper");
const corsConfig = require("./utils/corsConfigHelper");
const app = express();
const fileUpload = require("express-fileupload");
var https = require('https');
const urlPrefix = "https://zoeken.oba.nl/api/v1/search/";
const obaPublicKey = "1e19898c87464e239192c8bfe422f280";
const obaSecret = "4289fec4e962a33118340c888699438d";

app.get("/books/searchNew", (req, res) => {
    // Note: The query string is '?q=<searchString>'
    const url = urlPrefix + `?q=${req.query.q}&authorization=${obaPublicKey}&refine=true&output=json`;
    const request = https.get(url, {
        timeout: 10000,
        headers: {
            "AquaBrowser": obaSecret,
            "User": "Team-3",
            "Content-Type": "application/json; charset=utf-8;"
        },
    }, (obaResponse) => {
        let bodyChunks = [];
        obaResponse.on('data', (chunk) => {
            // process streamed parts here...
            bodyChunks.push(chunk);
        }).on("end", () => {
            const json = Buffer.concat(bodyChunks).toString();

            //send to the one who request this route(eg. front-end), it's already json so dont use .json(..)

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

            res.status(httpOkCode).send(json);
        })
    });

    request.on("error", err => {
        res.status(badRequestCode).json({reason: err})
    });

    request.end();
});

//logger lib  - 'short' is basic logging info
app.use(morgan("short"));

//init mysql connectionpool
const connectionPool = db.init();

//parsing request bodies from json to javascript objects
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS config - Cross Origin Requests
app.use(corsConfig);

//File uploads
app.use(fileUpload());

// ------ ROUTES - add all api endpoints here ------
const httpOkCode = 200;
const badRequestCode = 400;
const authorizationErrCode = 401;

app.post("/user/login", (req, res) => {
    const username = req.body.username;

    //TODO: We shouldn't save a password unencrypted!! Improve this by using cryptoHelper :)
    const password = req.body.password;

    db.handleQuery(
        connectionPool, {
            query: "SELECT username, password FROM user WHERE username = ? AND password = ?",
            values: [username, password],
        },
        (data) => {
            if (data.length === 1) {
                //return just the username for now, never send password back!
                res.status(httpOkCode).json({username: data[0].username});
            } else {
                //wrong username
                res
                    .status(authorizationErrCode)
                    .json({reason: "Wrong username or password"});
            }
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
});

app.get("/location", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM busyLocation"
        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
});

app.get("/visitoryear", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT SUM(`visitors`) as 'amount', `location`, `year` FROM `visitordata` " +
                "WHERE `year` < 2020 " +
                "GROUP BY `location`, `year` " +
                "ORDER BY `location`"
        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
});

app.get("/visitoryear/allLocations", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT DISTINCT `location` FROM `visitordata` " +
                "WHERE `year` < 2020 " +
                "ORDER BY `location`"
        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
});

//Request featured books and Query featured, get books
app.get("/featured", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT Image FROM featured"
        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Query to retrieve visitors data to compare them in percentages
app.get("/percentageYear", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT SUM(`visitors`) as 'amount', `year` FROM `visitordata` " +
                "GROUP BY `year`"
        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
});

//Get all districts
app.get("/location/districts", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM `district`"
        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all locations that belongs to one district
app.get("/location/all", (req, res) => {

    const districtId = req.query.district;

    db.handleQuery(
        connectionPool, {
            query: "SELECT `location`.* FROM `location` WHERE `location`.`id` = ?",
            values: [districtId],

        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all years of the visitors data
app.get("/location/allDate", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM `date`",
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all years of the visitors data
app.get("/location/allYears", (req, res) => {

    const location = req.query.location;

    db.handleQuery(
        connectionPool, {
            query: "SELECT DISTINCT `year` FROM `visitordata` WHERE `location` =  ? ORDER BY `year` ASC",
            values: [location],

        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all quarters of the visitors data
app.get("/location/allQuarterOfAYear", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT `name` FROM `datenames` WHERE `id` = 3",
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all months of the visitors data
app.get("/location/allMonthsOfAYear", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT `name` FROM `datenames` WHERE `id` = 2",
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all weeks of the visitors data
app.get("/location/allWeeksOfAYear", (req, res) => {
    const location = req.query.location;
    const year = req.query.year;

    db.handleQuery(
        connectionPool, {
            query: "SELECT `location`, `year`, `week`, `visitors` FROM `visitordata` WHERE `visitordata`.`location` = ? " +
                "AND `visitordata`.`year` = ? GROUP by `week` ASC",
            values: [location, year],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all visitors data of a chosen location, month and year
app.get("/location/allMonths", (req, res) => {

    const location = req.query.location;
    const year = req.query.year;
    const month = req.query.month;

    db.handleQuery(
        connectionPool, {
            query: "SELECT `month`, `location`, `year`, SUM(`visitors`) as 'amount' " +
                "FROM `visitordata` WHERE `visitordata`.`location` = ? " +
                "AND `visitordata`.`year` = ? AND `visitordata`.`month` = ? " +
                "ORDER BY FIELD(`month`, 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli'," +
                "'augustus', 'september', 'oktober', 'november', 'december')",

            values: [location, year, month],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all visitors data of a chosen location, week and year
app.get("/location/chosenWeek", (req, res) => {

    const location = req.query.location;
    const week = req.query.week;
    const year = req.query.year;

    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM `visitordata` WHERE `visitordata`.`location` = ? AND " +
                "`visitordata`.`week` = ? AND `visitordata`.`year` = ? " +
                "ORDER BY FIELD(`weekday`, 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag')",
            values: [location, week, year],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all visitors data of a chosen location, week and year
app.get("/location/chosenMonth", (req, res) => {

    const location = req.query.location;
    const month = req.query.month;
    const year = req.query.year;

    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM `visitordata` WHERE `visitordata`.`location` = ? AND " +
                "`visitordata`.`month` = ? AND `visitordata`.`year` = ?",
            values: [location, month, year],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all visitors data of the first quarter, data per week
app.get("/location/firstQuarter", (req, res) => {

    const location = req.query.location;
    const year = req.query.year;

    db.handleQuery(
        connectionPool, {
            query: "SELECT `month`, `week`, `location`, `year`, SUM(`visitors`) as 'amount' FROM " +
                "`visitordata` WHERE `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND " +
                "`visitordata`.`month` = 'januari' " +
                "OR `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND `visitordata`.`month` = 'februari' " +
                "OR `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND `visitordata`.`month` = 'maart' " +
                "GROUP BY `week` ASC",
            values: [location, year, location, year, location, year],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all visitors data of the second quarter, data per week
app.get("/location/secondQuarter", (req, res) => {

    const location = req.query.location;
    const year = req.query.year;

    db.handleQuery(
        connectionPool, {
            query: "SELECT `month`, `week`, `location`, `year`, SUM(`visitors`) as 'amount' FROM " +
                "`visitordata` WHERE `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND " +
                "`visitordata`.`month` = 'april' " +
                "OR `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND `visitordata`.`month` = 'mei' " +
                "OR `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND `visitordata`.`month` = 'juni' " +
                "GROUP BY `week` ASC",
            values: [location, year, location, year, location, year],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all visitors data of the third quarter, data per week
app.get("/location/thirdQuarter", (req, res) => {

    const location = req.query.location;
    const year = req.query.year;

    db.handleQuery(
        connectionPool, {
            query: "SELECT `month`, `week`, `location`, `year`, SUM(`visitors`) as 'amount' FROM " +
                "`visitordata` WHERE `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND " +
                "`visitordata`.`month` = 'juli' " +
                "OR `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND `visitordata`.`month` = 'augustus' " +
                "OR `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND `visitordata`.`month` = 'september' " +
                "GROUP BY `week` ASC",
            values: [location, year, location, year, location, year],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all visitors data of the fourth quarter, data per week
app.get("/location/fourthQuarter", (req, res) => {

    const location = req.query.location;
    const year = req.query.year;

    db.handleQuery(
        connectionPool, {
            query: "SELECT `month`, `week`, `location`, `year`, SUM(`visitors`) as 'amount' FROM " +
                "`visitordata` WHERE `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND " +
                "`visitordata`.`month` = 'oktober' " +
                "OR `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND `visitordata`.`month` = 'november' " +
                "OR `visitordata`.`location` = ? AND `visitordata`.`year` = ? AND `visitordata`.`month` = 'december' GROUP BY `week` ASC",
            values: [location, year, location, year, location, year],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

//Get all visitors data of a chosen location, week and year
app.get("/location/chosenYear", (req, res) => {

    const location = req.query.location;
    const year = req.query.year;

    db.handleQuery(
        connectionPool, {
            query: "SELECT `month`, `location`, `year`, SUM(`visitors`) as 'amount' FROM `visitordata` WHERE `visitordata`.`location` = ? " +
                "AND `visitordata`.`year` = ? GROUP BY `month`" +
                "ORDER BY FIELD(`month`, 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli'," +
                "'augustus', 'september', 'oktober', 'november', 'december')",
            values: [location, year],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

app.post("/upload", function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(badRequestCode).json({reason: "No files were uploaded."});
    }

    let sampleFile = req.files.sampleFile;

    let filePath = appPath + "server/XMLData/XMLBezoekers.xml"


    sampleFile.mv(filePath, function (err) {
        if (err) {
            return res.status(badRequestCode).json({reason: err});
        }


        let date;
        let year;
        let month;
        let week;
        let day;
        let weekday;
        let location;
        let visitors;

        const xml2js = require('xml2js');
        const fs = require('fs');
        const parser = new xml2js.Parser({attrkey: "ATTR"});
        let xml_string = fs.readFileSync(filePath, "utf8");


        parser.parseString(xml_string, function (error, result) {
            if (error === null) {

                for (let i = 0; i < result["oba-data-bezoekers"].record.length; i++) {

                    if (result["oba-data-bezoekers"].record[i].jaar[0] == 2013 || result["oba-data-bezoekers"].record[i].jaar[0] == 2014) {

                    } else {

                        date = result["oba-data-bezoekers"].record[i].datum[0];
                        year = result["oba-data-bezoekers"].record[i].jaar[0];
                        month = result["oba-data-bezoekers"].record[i].maand[0];
                        week = result["oba-data-bezoekers"].record[i].week[0];
                        day = result["oba-data-bezoekers"].record[i].dag[0];
                        weekday = result["oba-data-bezoekers"].record[i].weekdag[0];
                        location = result["oba-data-bezoekers"].record[i].vestiging[0];
                        visitors = result["oba-data-bezoekers"].record[i].bezoekers[0];


                        db.handleQuery(
                            connectionPool, {
                                query: "INSERT INTO `visitordata` (`date`, `year`, `month`, `week`, `day`, `weekday`, `location`, `visitors`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                                values: [date, year, month, week, day, weekday, location, visitors],
                            },
                            (data) => {
                                console.log((i + 1) + " of the " + result["oba-data-bezoekers"].record.length + " inserted")
                            },
                            (err) => res.status(badRequestCode).json({reason: err})
                        );
                    }
                }

                return res.status(httpOkCode).json("All dates inserted");

            } else {
                console.log(error);
                res.status(badRequestCode).json({reason: err});
            }
        });


    });
});

app.get("/weekdayVisitors", (req, res) => {

    const year = req.query.year;
    const location = req.query.location;


    db.handleQuery(
        connectionPool, {
            query: "SELECT AVG (`visitors`) AS 'average' FROM `visitordata` WHERE `year` = ? AND `location` = ? AND `weekday`= ?" +
                "UNION " +
                "SELECT AVG(`visitors`) FROM `visitordata` WHERE `year` = ? AND `location` = ? AND `weekday`= ?" +
                "UNION " +
                "SELECT AVG(`visitors`) FROM `visitordata` WHERE `year` = ? AND `location` = ? AND `weekday`= ?" +
                "UNION " +
                "SELECT AVG(`visitors`) FROM `visitordata` WHERE `year` = ? AND `location` = ? AND `weekday`= ?" +
                "UNION " +
                "SELECT AVG(`visitors`) FROM `visitordata` WHERE `year` = ? AND `location` = ? AND `weekday`= ?" +
                "UNION " +
                "SELECT AVG(`visitors`) FROM `visitordata` WHERE `year` = ? AND `location` = ? AND `weekday`= ?" +
                "UNION " +
                "SELECT AVG(`visitors`) FROM `visitordata` WHERE `year` = ? AND `location` = ? AND `weekday`= ?",
            values: [year, location, "maandag", year, location, "dinsdag", year, location, "woensdag", year, location, "donderdag", year, location, "vrijdag", year, location, "zaterdag", year, location, "zondag"]
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
            console.log(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

app.get("/weekdayVisitors/yearOptions", (req, res) => {

    db.handleQuery(
        connectionPool, {
            query: "SELECT DISTINCT `year` FROM `visitordata`",
            values: [],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})

app.get("/weekdayVisitors/locationOptions", (req, res) => {

    db.handleQuery(
        connectionPool, {
            query: "SELECT DISTINCT `location` FROM `visitordata`",
            values: [],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})


//------- END ROUTES -------
module.exports = app;

