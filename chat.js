const chatBOx = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const mainchatContainer = document.querySelector(".main-chat-container");
const Newchatbtn = document.querySelector(".newchat");
const aiHelpLink = document.getElementById("ai-help-link");
const dashboard = document.getElementById('dashboard-content');
let chatHistory = []; // this acts a s  a array that holds the history

if (aiHelpLink) {
    aiHelpLink.addEventListener("click", (e) => {
        e.preventDefault();
        dashboard.style.display="none";
        mainchatContainer.style.display = "flex";
    });
}


// for new chat and deleting previous stored files
if (Newchatbtn) {

    Newchatbtn.addEventListener("click", () => {
        localStorage.removeItem("guffhistory");
        chatBOx.innerHTML = "";
        chatHistory = [];
    });
}

window.onload = () => {
    const savedchat = localStorage.getItem("guffhistory");
    console.log({ savedchat }); // this help us to prind the whatever thing that is foundedin console
    if (savedchat) {
        chatBOx.innerHTML = savedchat;
        chatBOx.scrollTop = chatBOx.scrollHeight;
    }
}

// for message bubble 
function addMessage(message, className) { // this is function and this only appears when the user calls it 
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.textContent = message;
    chatBOx.appendChild(msgDiv); // yesley chahi message lai lagera chatbox tala naya div generate garera rakhxw it measns tesley afno clild banauxw
    chatBOx.scrollTop = chatBOx.scrollHeight; //scrolltop vaneko scrool ahiley kaha xw vnna khojya ho 
}

// for the process showing ot the user
function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "message-bot");
    typingDiv.textContent = " sathi i am working..";
    chatBOx.appendChild(typingDiv);
    chatBOx.scrollTop = chatBOx.scrollHeight;
    return typingDiv;
}


//for calling the api and get the value form it 
async function getsathireply(userMessage) {
    const BACKEND_url = "https://ai-backend-two-theta.vercel.app/api/chat";
    // for letting the history save 
    chatHistory.push({ role: "user", content: userMessage });
    try {
        const response = await fetch(BACKEND_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({
                messages: chatHistory // this sends the whole string that is present in the array chathistory saved .
            })
        });

        const data = await response.json();
        console.log("DATA:", JSON.stringify(data));



        if (!response.ok) {
            console.error("Server Error", data);
            return data?.error?.message || "Error fetching response"

        }
        const reply = data?.choices?.[0]?.message?.content;
        //here ?. means if exists and this is used instead of . cause it don;t lead to the crash of the code
        if(reply) chatHistory.push({ role: "assistant", content: reply });
        return reply || "sorry i couldn't get any response";

    } catch (error) {
        console.log("Error:", error);
        return "cannot connect to ai try again later ..";

    }

}


// things that start after clicking send
sendBtn.onclick = async () => {
    const message = userInput.value.trim();
    console.log(message); //yesley chahi typebox ma lekheko chij lai browser ko console ma rakhxw
    if (message === "")
        return; // this makes the message not go to the server if user hasn;t typed anything yet 
    addMessage(message, "message-user");
    userInput.value = ""; // it maks the text out clear


    const typingDiv = showTyping();
    const sathiReply = await getsathireply(message);

    typingDiv.remove();
    addMessage(sathiReply, "message-bot");
    //yesley chahi local storage ma hamro message hold up grxw 
    localStorage.setItem("guffhistory", chatBOx.innerHTML);

}

//adding press to enter or send message\
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
})