import { Context, Markup, Telegraf } from 'telegraf';
import { CronJob } from 'cron';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';
import { Actions } from './actions.enum';
import { CONFIG } from '../config/config';
import { IConfigService } from '../config/config.interface';

import fs from 'fs';

export class StartCommand extends Command {
  constructor(
    bot: Telegraf<IBotContext>,
    private readonly configService: IConfigService
    ) {
    super(bot);
  }

  handle(): void {
    this.botStart();

    this.getSoftAction();

    this.verifyRegistrationAction();
  }

  private sendDailyNotification(ctx: Context) {
    const notificationMessage = 'Вы не завершили регистрацию!';

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('💰 Получить софт', Actions.get_soft)],
      [Markup.button.url('👩‍💻 Написать мне', 'https://t.me/darkan0nim')],
      [Markup.button.url('🔥 Перейти на канал', 'https://t.me/ithumor')]
    ]);

    if (!ctx.chat) throw Error("Can't find chat");

    this.bot.telegram.sendPhoto(ctx.chat.id, { source: fs.readFileSync('./assets/alert.jpg') },  {
      caption: notificationMessage,
      ...keyboard,
    });
  }

  private getSoftAction() {
    this.bot.action(Actions.get_soft, (ctx) => {
      const getSoftText = "Привет!🔥 Если ты хочешь зарабатывать по БОЛЬШИМ КОЭФФИЦИЕНТАМ и пользоваться НАШИМ ЛИЧНЫМ ВЗЛОМ СОФТОМ с коэффициентами 4-6x в нашем закрытом ВИП чате\n" +
        "\n" +
        "⚠️Нужно выполнить ряд действий для того что бы Стратегия начала работать!\n" +
        "\n" +
        "✅ЭТО БЕСПЛАТНО✅\n" +
        "\n" +
        "❌Без этих действий стратегия работать не будет❌\n" +
        "\n" +
        "📲Для начала необходимо провести регистрацию на сайте игры LuckyJet.\n" +
        "\n" +
        "1. 📍Аккаунт должен быть НОВЫМ, если вы переходите по ссылке и попадаете на старый, необходимо выйти с него и заново перейти по кнопке «РЕГИСТРАЦИЯ»\n" +
        "\n" +
        "2. 📍После РЕГИСТРАЦИИ, нажмите кнопку «ПРОВЕРИТЬ РЕГИСТРАЦИЮ»\n" +
        "\n" +
        "👨‍💻Если у вас есть вопросы, напиши мне";

        const keyboard = Markup.inlineKeyboard([
          [Markup.button.url('📲 РЕГИСТРАЦИЯ', 'https://cas.x-go-leads.com/click?pid=9946&offer_id=1171')],
          [Markup.button.callback('👩‍💻 ПРОВЕРИТЬ РЕГИСТРАЦИЮ', Actions.verify_registration)],
          [Markup.button.url('👩‍💻 Написать мне', 'https://t.me/darkan0nim')]
        ]);

      ctx.replyWithPhoto({source: fs.readFileSync('./assets/pepe.jpg'),}, {
        caption: getSoftText,
        ...keyboard
      })
    });
  }

  private verifyRegistrationAction() {
    this.bot.action(Actions.verify_registration, (ctx) => {
      const userIsRegister = ctx.session.isRegister;

      const successText = "✅Регистрация ПРОЙДЕНА!";

      const failedText = "❌Регистрация НЕ ПРОЙДЕНА!\n" +
        "\n" +
        "📲Для начала необходимо провести регистрацию на сайте игры LuckyJet/ Rocket Queen\n" +
        "\n" +
        "1. 📍Аккаунт должен быть НОВЫМ, если вы переходите по ссылке и попадаете на старый, необходимо выйти с него и заново перейти по кнопке «РЕГИСТРАЦИЯ»\n" +
        "\n" +
        "2. 📍После РЕГИСТРАЦИИ, нажмите кнопку «ПРОВЕРИТЬ РЕГИСТРАЦИЮ»\n" +
        "\n" +
        "‼️Если Вам Бот написал  «РЕГИСТРАЦИЯ НЕ ПРОЙДЕНА» попробуйте проверить по кнопке ниже через 5 минут. Если не помогло👇\n" +
        "\n" +
        "✅РЕШЕНИЕ ВОПРОСА В ЭТОМ ВИДЕО в КАНАЛЕ: https://t.me/c/1896323872/15\n" +
        "\n" +
        "🔰А если Вы выполнили регистрацию и спустя более 5 минут бот не видит ее, напиши мне👨‍💻"
      ;

      const userText = userIsRegister ? successText : failedText;

      ctx.editMessageMedia({
        type: 'photo',
        media: { source: fs.readFileSync('./assets/cat2.jpg') },
        caption: userText
      });
    });
  }

  private botStart() {
    this.bot.start((ctx) => {
      const welcomeMessage =
        '‼️Обязательно перед началом посмотри видео👆\n' +
        '\n' +
        '🔥Привет, меня зовут Саша, и я зарабатываю на своем софте по взлому Lucky Jet и Rocket Queen, в видео я показал, как это работает!\n' +
        '\n' +
        '💰Хочешь зарабатывать как я?\n' +
        '\n' +
        '📍Если возникли вопросы, пиши мне в любое время по кнопке "Написать мне"';

      const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('💰 Получить софт', Actions.get_soft)],
        [Markup.button.url('👩‍💻 Написать мне', 'https://t.me/darkan0nim')],
        [Markup.button.url('🔥 Перейти на канал', 'https://t.me/ithumor')]
      ]);

      ctx.replyWithPhoto({ source: fs.readFileSync('./assets/cat1.jpg') }, {
        caption: welcomeMessage,
        ...keyboard,
      });

      const userIsRegister = ctx.session.isRegister;

      if (!userIsRegister) {
        const dailyNotificationJob = CronJob.from({
          cronTime: this.configService.get(CONFIG.DAILY_NOTIFICATION),
          onTick: () => {
            this.sendDailyNotification(ctx);
          },
        });

        dailyNotificationJob.start();
      }
    });
  }
}
