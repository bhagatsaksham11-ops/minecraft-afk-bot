const mineflayer = require('mineflayer')
const axios = require('axios')

const CONFIG = {
  host: 'thunderforge.mcsh.io',
  port: 25565,
  username: 'AFK_Bot',
  password: '123456',
  owner: 'YourIGN',
  discordWebhook: 'YOUR_DISCORD_WEBHOOK'
}

let bot

function createBot() {
  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username
  })

  bot.on('spawn', () => {
    console.log("Bot joined")

    setTimeout(() => {
      bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`)
      bot.chat(`/login ${CONFIG.password}`)
    }, 3000)

    randomMovement()
    autoChat()
  })

  function randomMovement() {
    setInterval(() => {
      const moves = ['forward', 'back', 'left', 'right']
      const move = moves[Math.floor(Math.random() * moves.length)]

      bot.setControlState(move, true)

      setTimeout(() => {
        bot.setControlState(move, false)
      }, 1200)

    }, 5000)
  }

  function autoChat() {
    const msgs = ["AFK 😎", "Grinding 🔥", "Hello SMP", "GG"]
    
    setInterval(() => {
      bot.chat(msgs[Math.floor(Math.random() * msgs.length)])
    }, 20000)
  }

  bot.on('chat', async (username, message) => {
    if (username === bot.username) return

    try {
      await axios.post(CONFIG.discordWebhook, {
        content: `[MC] ${username}: ${message}`
      })
    } catch (e) {}
  })

  bot.on('end', () => {
    console.log("Reconnecting...")
    setTimeout(createBot, 3000)
  })

  bot.on('error', console.log)
  bot.on('kicked', console.log)
}

createBot()
