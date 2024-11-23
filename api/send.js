const Pusher = require("pusher");

// Replace with your Pusher keys
const pusher = new Pusher({
  appId: "1900495",
  key: "61a417a460e238330af5",
  secret: "41055aa125da057c0808",
  cluster: "ap2",
  useTLS: true,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, message } = req.body;

    try {
      await pusher.trigger("chat-room", "new-message", {
        username: username,
        message: message,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
