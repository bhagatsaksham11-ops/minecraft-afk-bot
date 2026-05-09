const mineflayer = require('mineflayer')
const { pathfinder, goals } = require('mineflayer-pathfinder')
const { GoalFollow } = goals

const CONFIG = {
  host: 'thunderforge.mcsh.io',
  port: 25565,
  username: 'AFK_Bot',
  password: '123456',
  owner: 'YourIGN',
  version: '1.21.1' // 🔥 IMPORTANT
}

let bot

function createBot() {
  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version
  })

  bot.loadPlugin(pathfinder)

  bot.on('spawn', () => {
    console.log("Bot joined")

    setTimeout(() => {
      bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`)
      bot.chat(`/login ${CONFIG.password}`)
    }, 3000)

    randomMovement()
    autoChat()
    followOwner()
  })

  // 🔥 RANDOM MOVEMENT
  function randomMovement() {
    const moves = ['forward', 'back', 'left', 'right']

    setInterval(() => {
      const move = moves[Math.floor(Math.random() * moves.length)]

      bot.setControlState(move, true)

      setTimeout(() => {
        bot.setControlState(move, false)
      }, 1000)

    }, 5000)
  }

  // 🔥 AUTO CHAT
  function autoChat() {
    const msgs = [
      "AFK 😎",
      "Grinding 🔥",
      "Hello SMP",
      "Nice server!",
      "GG everyone"
    ]

    setInterval(() => {
      bot.chat(msgs[Math.floor(Math.random() * msgs.length)])
    }, 20000)
  }

  // 🔥 FOLLOW OWNER
  function followOwner() {
    setInterval(() => {
      const player = bot.players[CONFIG.owner]

      if (player && player.entity) {
        bot.pathfinder.setGoal(new GoalFollow(player.entity, 2))
      }
    }, 3000)
  }

  // 🔥 DISCORD (OPTIONAL WEBHOOK)
  bot.on('chat', async (username, message) => {
    if (username === bot.username) return
    console.log(`${username}: ${message}`)
  })

  // 🔥 AUTO RECONNECT
  bot.on('end', () => {
    console.log("Reconnecting...")
    setTimeout(createBot, 5000)
  })

  bot.on('error', () => {})
}

createBot()
