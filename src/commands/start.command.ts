import { Markup, Telegraf } from 'telegraf';
import { CronJob } from 'cron';
import { Command } from './command.class';
import { GEO, IBotContext } from '../context/context.interface';
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

    this.chooseGeoMexico();

    this.chooseGeoColumbia();

    this.chooseGeoChile();

    this.chooseGeoEcuador();

    this.chooseGeoPeru();
  }

  protected botStart() {
    this.bot.start(async (ctx) => {
      ctx.session.ref_id = Math.floor(Math.random() * 10001);
      ctx.session.chat_id = ctx.chat.id;

      await ctx.replyWithPhoto({ source: fs.readFileSync('./assets/welcome.jpg') }, {
        caption: captions.aboutMe,
        parse_mode: "HTML",
      });

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🇲🇽 México', Actions.choose_geo_mexico)],
        [Markup.button.callback('🇵🇪 Perú', Actions.choose_geo_peru)],
        [Markup.button.callback('🇨🇴 Colombia', Actions.choose_geo_colombia)],
        [Markup.button.callback('🇪🇨 Ecuador', Actions.choose_geo_ecuador)],
        [Markup.button.callback('🇨🇱 Chile', Actions.choose_geo_chile)],
      ]);

      setTimeout(async () => {
        await ctx.replyWithHTML(captions.chooseLocation, {
          ...keyboard
        })
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
      [Markup.button.url(buttons.writeMe, ctx.session.bot_link)]
    ]);

    this.bot.telegram.sendPhoto(ctx.chat.id, { source: fs.readFileSync('./assets/deposit.jpg') },  {
      caption: captions.verifyRegistration.success,
      parse_mode: 'HTML',
      ...keyboard,
    });
  }

  protected verifyRegistrationAction() {
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
          [Markup.button.url(buttons.writeMe, ctx.session.bot_link)]
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
          [Markup.button.url(buttons.writeMe, ctx.session.bot_link)]
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

  protected verifyDeposit() {
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
            [Markup.button.url(buttons.joinVip, ctx.session.telegram_channel_link)]
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
            [Markup.button.url(buttons.writeMe, ctx.session.bot_link)]
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

  protected chooseGeoMexico() {
    this.bot.action(Actions.choose_geo_mexico, async (ctx) => {
        ctx.session.geo = GEO.MEXICO;

        this.setGeo(ctx.session.geo, ctx);
    });
  }

  protected chooseGeoColumbia() {
    this.bot.action(Actions.choose_geo_colombia, async (ctx) => {
      ctx.session.geo = GEO.COLUMBIA;

      this.setGeo(ctx.session.geo, ctx);
    });
  }

  protected chooseGeoChile() {
    this.bot.action(Actions.choose_geo_chile, async (ctx) => {
      ctx.session.geo = GEO.CHILE;

      this.setGeo(ctx.session.geo, ctx);
    });
  }

  protected chooseGeoEcuador() {
    this.bot.action(Actions.choose_geo_ecuador, async (ctx) => {
      ctx.session.geo = GEO.ECUADOR;

      this.setGeo(ctx.session.geo, ctx);
    });
  }

  protected chooseGeoPeru() {
    this.bot.action(Actions.choose_geo_peru, async (ctx) => {
      ctx.session.geo = GEO.PERU;

      this.setGeo(ctx.session.geo, ctx);
    });
  }

  protected textOn() {
    this.bot.on('text', async (ctx) => {
     await ctx.reply(captions.replyText, {
        parse_mode: 'HTML'
      });
    });
  }

  private setGeo(geo: GEO, ctx: IBotContext) {
    const botLink = this.getGeoBotLink(geo);
    const telegramChannelLink = this.getGeoTelegramChannelLink(geo);

    ctx.session.bot_link = botLink;
    ctx.session.telegram_channel_link = telegramChannelLink;


    const keyboard = Markup.inlineKeyboard([
        [Markup.button.url(buttons.register, `${this.configService.get(CONFIG.REGISTER_LINK)}&ref_id=${ctx.session.ref_id}`)],
        [Markup.button.callback(buttons.verifyRegister, Actions.verify_registration)],
        [Markup.button.url(buttons.writeMe, ctx.session.bot_link)],
      ]);

    ctx.replyWithPhoto({ source: fs.readFileSync('./assets/register.jpg') }, {
      caption: captions.registerText,
      parse_mode: 'HTML',
      ...keyboard
        });
  }

  private getGeoBotLink(geo: GEO): string {
    let contactBotLink = this.configService.get(CONFIG.MEXICO_BOT_LINK);

    switch(geo) {
      case GEO.MEXICO:
        contactBotLink = this.configService.get(CONFIG.MEXICO_BOT_LINK);
        break;
      case GEO.CHILE: 
        contactBotLink = this.configService.get(CONFIG.CHILE_BOT_LINK);
        break;
      case GEO.COLUMBIA: 
        contactBotLink = this.configService.get(CONFIG.COLUMBIA_BOT_LINK);
        break;
      case GEO.ECUADOR: 
        contactBotLink = this.configService.get(CONFIG.ECUADOR_BOT_LINK);
        break;
      case GEO.PERU: 
        contactBotLink = this.configService.get(CONFIG.ECUADOR_BOT_LINK);
        break;
    }

    return contactBotLink;
  }

  private getGeoTelegramChannelLink(geo: GEO): string {
    let telegramChannelLink = this.configService.get(CONFIG.MEXICO_TELEGRAM_CHANNEL);

    switch(geo) {
      case GEO.MEXICO:
        telegramChannelLink = this.configService.get(CONFIG.MEXICO_TELEGRAM_CHANNEL);
        break;
      case GEO.CHILE: 
        telegramChannelLink = this.configService.get(CONFIG.CHILE_TELEGRAM_CHANNEL);
        break;
      case GEO.COLUMBIA: 
        telegramChannelLink = this.configService.get(CONFIG.COLUMBIA_TELEGRAM_CHANNEL);
        break;
      case GEO.ECUADOR: 
        telegramChannelLink = this.configService.get(CONFIG.ECUADOR_TELEGRAM_CHANNEL);
        break;
      case GEO.PERU: 
        telegramChannelLink = this.configService.get(CONFIG.ECUADOR_TELEGRAM_CHANNEL);
        break;
    }

    return telegramChannelLink;
  }
}
