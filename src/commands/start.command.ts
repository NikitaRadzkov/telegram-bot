import { Markup, Telegraf } from 'telegraf';
import { CronJob } from 'cron';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';
import { Actions } from './actions.enum';
import { CONFIG } from '../config/config';
import { IConfigService } from '../config/config.interface';

import fs from 'fs';
import { DataJSON, SessionsJSON } from './data.interface';
import { buttons, captions } from '../content';

export class StartCommand extends Command {
  constructor(
    bot: Telegraf<IBotContext>,
    private readonly configService: IConfigService
    ) {
    super(bot);
  }

  handle(): void {
    this.botStart();

    this.textOn();

    this.verifyRegistrationAction();

    this.verifyDeposit();
  }

  private botStart() {
    this.bot.start(async (ctx) => {
      ctx.session.ref_id = Math.floor(Math.random() * 10001);
      ctx.session.chat_id = ctx.chat.id;

      await ctx.replyWithPhoto({ source: fs.readFileSync('./assets/welcome.jpg') }, {
        caption: captions.aboutMe,
        parse_mode: "HTML",
      });

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.url(buttons.register, `${this.configService.get(CONFIG.REGISTER_LINK)}&ref_id=${ctx.session.ref_id}`)],
        [Markup.button.callback(buttons.verifyRegister, Actions.verify_registration)],
        [Markup.button.url(buttons.writeMe, this.configService.get(CONFIG.VIP_CANAL_LINK))]
      ]);

      setTimeout(async () => {
        await ctx.replyWithPhoto({ source: fs.readFileSync('./assets/register.jpg') }, {
          caption: captions.registerText,
          parse_mode: 'HTML',
          ...keyboard
        });
      }, 5000);

      const dailyNotificationJob = CronJob.from({
        cronTime: this.configService.get(CONFIG.DAILY_NOTIFICATION),
        onTick: () => {
          this.eventDailyNotification(ctx);
        },
       });

      dailyNotificationJob.start();
    });
  }

  private eventDailyNotification(ctx: IBotContext) {
    if (!ctx.chat) throw Error("Can't find chat");

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url(buttons.deposit, `${this.configService.get(CONFIG.REGISTER_LINK)}&ref_id=${ctx.session.ref_id}`)],
      [Markup.button.callback(buttons.verifyDeposit, Actions.verify_deposit)],
      [Markup.button.url(buttons.writeMe, this.configService.get(CONFIG.VIP_CANAL_LINK))]
    ]);

    this.bot.telegram.sendPhoto(ctx.chat.id, { source: fs.readFileSync('./assets/deposit.jpg') },  {
      caption: captions.verifyRegistration.success,
      parse_mode: 'HTML',
      ...keyboard,
    });
  }

  private verifyRegistrationAction() {
    this.bot.action(Actions.verify_registration, async (ctx) => {
      const dataContent: DataJSON[] = await JSON.parse(fs.readFileSync('data.json', 'utf8'));
      const sessionsContent: SessionsJSON = await JSON.parse(fs.readFileSync('sessions.json', 'utf8'));

      const currentSession = sessionsContent.sessions.find(session => session.id === `${ctx.chat?.id}:${ctx.chat?.id}`);

      if (!currentSession) throw Error(`Can't find refIdFromSession with id: ${ctx.chat?.id}:${ctx.chat?.id}`);

      dataContent.forEach((entry) => {
        if (currentSession.data.ref_id === entry.ref_id) {
          ctx.session.is_register = true;
        }
      });

      const userIsRegister = ctx.session.is_register;

      if (userIsRegister) {
        const keyboard = [
          [Markup.button.url(buttons.deposit, `${this.configService.get(CONFIG.REGISTER_LINK)}&ref_id=${ctx.session.ref_id}`)],
          [Markup.button.callback(buttons.verifyDeposit, Actions.verify_deposit)],
          [Markup.button.url(buttons.writeMe, this.configService.get(CONFIG.VIP_CANAL_LINK))]
        ];

        await ctx.editMessageMedia({
          type: 'photo',
          media: { source: fs.readFileSync('./assets/deposit.jpg') },
          caption: captions.verifyRegistration.success,
          parse_mode: 'HTML',
        });

        await ctx.editMessageReplyMarkup({
          inline_keyboard: keyboard
        });
      } else {
        const keyboard = [
          [Markup.button.url(buttons.register, `${this.configService.get(CONFIG.REGISTER_LINK)}&ref_id=${ctx.session.ref_id}`)],
          [Markup.button.callback(buttons.verifyRegister, Actions.verify_registration)],
          [Markup.button.url(buttons.writeMe, this.configService.get(CONFIG.VIP_CANAL_LINK))]
        ];

        await ctx.editMessageMedia({
          type: 'photo',
          media: { source: fs.readFileSync('./assets/register-failed.jpg') },
          caption: captions.verifyRegistration.failed,
          parse_mode: 'HTML',
        });

        await ctx.editMessageReplyMarkup({
          inline_keyboard: keyboard
        });
      }
    });
  }

  private verifyDeposit() {
    this.bot.action(Actions.verify_deposit, async (ctx) => {
      const dataContent: DataJSON[] = await JSON.parse(fs.readFileSync('data.json', 'utf8'));
      const sessionsContent: SessionsJSON = await JSON.parse(fs.readFileSync('sessions.json', 'utf8'));

      const currentSession = sessionsContent.sessions.find(session => session.id === `${ctx.chat?.id}:${ctx.chat?.id}`);

      if (!currentSession) throw Error(`Can't find refIdFromSession with id: ${ctx.chat?.id}:${ctx.chat?.id}`);

      const userData = dataContent.find(el => el.ref_id === currentSession.data.ref_id);

      if (!userData) throw Error(`Can't find userData with ref id: ${currentSession.data.ref_id}`);

      if (userData.order_sum > 0) {
        ctx.session.is_deposit = true
      } else {
        ctx.session.is_deposit = false
      }

      const userIsDeposit = ctx.session.is_deposit;

        if (userIsDeposit) {
          const keyboard = [
            [Markup.button.url(buttons.joinVip, this.configService.get(CONFIG.VIP_CANAL_LINK))]
          ];
  
          await ctx.editMessageMedia({
            type: 'photo',
            media: { source: fs.readFileSync('./assets/vip.jpg') },
            caption: captions.verifyDeposit.success,
            parse_mode: 'HTML',
          });
  
          await ctx.editMessageReplyMarkup({
            inline_keyboard: keyboard
          });
        } else {
          const keyboard = [
            [Markup.button.url(buttons.deposit, `${this.configService.get(CONFIG.REGISTER_LINK)}&ref_id=${ctx.session.ref_id}`)],
            [Markup.button.callback(buttons.verifyDeposit, Actions.verify_deposit)],
            [Markup.button.url(buttons.writeMe, this.configService.get(CONFIG.VIP_CANAL_LINK))]
          ];

          await ctx.editMessageMedia({
            type: 'photo',
            media: { source: fs.readFileSync('./assets/deposit-failed.jpg') },
            caption: captions.verifyDeposit.failed,
            parse_mode: 'HTML',
          });

          await ctx.editMessageReplyMarkup({
            inline_keyboard: keyboard
          });
        }
      
    });
  }

  private textOn() {
    this.bot.on('text', async (ctx) => {
     await ctx.reply(captions.replyText, {
        parse_mode: 'HTML'
      });
    });
  }
}
