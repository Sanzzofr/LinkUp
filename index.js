// Replace with your Pusher keys
const PUSHER_APP_KEY = "61a417a460e238330af5";
const PUSHER_CLUSTER = "ap2";

// Initialize Pusher
const pusher = new Pusher(PUSHER_APP_KEY, {
  cluster: PUSHER_CLUSTER,
  encrypted: true,
});

// Subscribe to a public channel (no secret key needed for public channels)
const channel = pusher.subscribe("chat-room");

// Select elements
const joinRoom = document.getElementById("joinRoom");
const chatRoom = document.getElementById("chatRoom");
const usernameInput = document.getElementById("username");
const joinButton = document.getElementById("joinButton");
const currentUserDisplay = document.getElementById("currentUser");
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Store current username
let currentUsername = "";

// Function to display messages
function addMessage(username, message, isSelf = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  if (isSelf) messageDiv.classList.add("me");
  messageDiv.textContent = `${username}: ${message}`;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle joining the chat room
joinButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) {
    currentUsername = username;
    currentUserDisplay.textContent = `Logged in as: ${username}`;
    joinRoom.classList.add("hidden");
    chatRoom.classList.remove("hidden");
    addMessage("System", "You have joined the chat room!", false);
  }
});

// Send message (you need to connect this to a secure backend to broadcast messages)
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    // Broadcast message via Pusher
    addMessage(currentUsername, message, true); // Show locally
    messageInput.value = "";

    // You'd need a secure backend endpoint for broadcasting
    fetch("https://link-up-pi-virid.vercel.app/api/send.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currentUsername,
        message: message,
      }),
    });
  }
});

// Listen for messages from other users
channel.bind("new-message", (data) => {
  if (data.username !== currentUsername) {
    addMessage(data.username, data.message, false);
  }
});
