// Base dependences
import path from "path";

// Setup express
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";

// Default routes
import router from "./routes/";

// Import controller
import { SpreadsheetController } from "./controllers/spreadsheet";

// Setup config
import config from "./config/config";
const { base, port } = config;

// Setup logging
const onError = (error: any) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Define spreadsheet URLs
const departureUrl: string = base.spreadsheetUrlBase + base.departuresGid;
const definitionUrl: string = base.spreadsheetUrlBase + base.definitionsGid;

// Seed departures and definitions with initial data
SpreadsheetController.legendSeed(definitionUrl, true);
SpreadsheetController.departureSeed(departureUrl, true);

// Refresh departures at an interval
const updateInterval: number =
    process.env.UPDATE_INTERVAL ? parseInt(process.env.UPDATE_INTERVAL, 10) :
    base.defaultUpdateInterval;

setInterval(() => {
    SpreadsheetController.departureSeed(departureUrl, false);
}, updateInterval);

const app = express();
app.set("env", base.env);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500).send({ error: err.message });
});

app.on("error", onError);

app.listen(port, () => {
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    console.log("Listening on " + bind);
});
