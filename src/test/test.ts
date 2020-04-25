//This file contains test server implimentation for testng purposes
import * as express from "express";

const app = express();
const testPort = 8080;

app.get("/list", (req, res) => {
    const od = req.params.only_deployed || false;
    const ans = [
        { hostname: "1.falcon.com", deployed: true },
        { hostname: "2.falcon.com", deployed: true },
        { hostname: "3.falcon.com", deployed: false },
        { hostname: "4.falcon.com", deployed: true },

    ]
    res.status(200).json({
        data: od ? ans.filter((v, i) => v.deployed == true) : ans
    });
})


app.listen(testPort, () => {
    console.log("Listening at 8080...")
})