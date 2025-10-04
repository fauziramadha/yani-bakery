export default async function handler(req, res) {
  const { message } = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Telegram error:", error);
    res.status(500).json({ success: false });
  }
}
