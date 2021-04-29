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

//Request all books
app.get("/books/all", (req, res) => {
    db.handleQuery(
        connectionPool, {
            query: "SELECT * FROM book",
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
});

//Insert books into database
app.post("/books/addBook", (req, res) => {

    const id = req.body.id;
    const title = req.body.title;
    const author = req.body.author;
    const genre = req.body.genre;
    const image = req.body.image;
    const recap = req.body.recap;

    db.handleQuery(
        connectionPool, {
            query: "INSERT INTO `book` (`idBook`, `Title`, `Author`, `Genre`, `Image`, `Recap`) VALUES (?, ?, ?, ?, ?, ?)",
            values: [id, title, author, genre, image, recap],
        },
        (data) => {
            //just give all data back as json
            res.status(httpOkCode).json(data);
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
            query: "SELECT * FROM visitoryear"
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

    let districtName = `${req.query.q}`;

    db.handleQuery(
        connectionPool, {
            query: "SELECT `location`.* FROM `location` WHERE `location`.`district_name` = ?",
            values: [districtName],

        },
        (data) => {

            //just give all data back as json
            res.status(httpOkCode).json(data);
        },
        (err) => res.status(badRequestCode).json({reason: err})
    );
})


app.post("/visitors", (req, res) => {

    let filePath;

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

    for (let i = 0; i < xml.getElementsByTagName("vestiging").length; i++) {
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

                console.log("All dates inserted")
                res.status(httpOkCode);

            } else {
                console.log(error);
                res.status(badRequestCode)
            }
        });
    }
});

//------- END ROUTES -------
module.exports = app;

