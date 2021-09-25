const socket = new WebSocket(`ws://${window.location.host}`);

const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");

function makeMessage(type, payload) {
    const message = { type, payload };
    return JSON.stringify(message);
}

socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;

    messageList.append(li);

    console.log(message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});


messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("message", input.value));
    input.value = "";
})

nickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
})