import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.start((ctx) => ctx.reply('Welcome!'));

bot.help((ctx) => ctx.reply('Send me a message and I will echo it back!'));

bot.on('text', (ctx) => {
  const messageText = ctx.message.text;
  ctx.reply(`You said: ${messageText}`);
});

bot.launch().then(() => {
  console.log('Bot is running');
});
