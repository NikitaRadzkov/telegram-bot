import "reflect-metadata";

import { Telegraf } from "telegraf";
import { container, inject, injectable } from "tsyringe";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { CONFIG } from "./config/config";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import LocalSession from "telegraf-session-local";
import { Logger } from "./logger/logger.service";

@injectable()
class Bot {
  bot: Telegraf<IBotContext>;
  commands: Command[] = [];

  constructor(@inject("IConfigService") private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get(CONFIG.BOT_TOKEN));
    this.bot.use(
      new LocalSession({ database: "sessions.json" }).middleware()
    );
  }

  async init() {
    this.commands = [new StartCommand(this.bot)];

    for (const command of this.commands) {
      command.handle();
    }

    try {
      Logger.info('Bot started successfully');
      await this.bot.launch();
    } catch (error) {
      Logger.error(`Error starting bot: ${error}`);
    }
  }
}

container.register<IConfigService>("IConfigService", { useClass: ConfigService });

const bot = container.resolve(Bot);
bot.init();
