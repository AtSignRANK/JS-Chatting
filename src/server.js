// npm run dev

import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`)

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const sockets = []
const nicknames = []

wss.on("connection", (socket) => {
    console.log("User Connected to Server ✅")
    sockets.push(socket);

    socket.on("message", (message) => {
        const parsed = JSON.parse(message.toString())
        const userNumber = sockets.indexOf(socket)
        
        if (parsed.type === "message") {
            if (nicknames[userNumber] == undefined) {
                socket.send("⛔ You must set your nickname!");
                return;
            }

            sockets.forEach(aSocket => aSocket.send(
                `${nicknames[userNumber]} : ${parsed.payload}`
                ));
        } else if (parsed.type === "nickname") {
            if (nicknames[userNumber] != undefined) {
                socket.send("⛔ You already have your nickname!");
                return
            }

            nicknames[userNumber] = parsed.payload;
        }
        console.log(message.toString());
    })
});

server.listen(3000, handleListen);
