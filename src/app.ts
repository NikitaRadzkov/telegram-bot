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
import express from 'express';
import fs from 'fs/promises';

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
    try {
      this.commands = [new StartCommand(this.bot, this.configService)];

      for (const command of this.commands) {
        command.handle();
      }

      Logger.info('Bot started successfully');
      await this.bot.launch();
    } catch (error) {
      Logger.error(`Error starting bot: ${error}`);
    }
  }
}

container.register<IConfigService>("IConfigService", { useClass: ConfigService });

const app = express();
const configService = new ConfigService();

app.get('/stats', async (req, res) => {
  try {
    const status = req.query.status;
    const geo = req.query.geo;
  
    const data = { status, geo };
    let existingData = [];
    const fileContent = await fs.readFile('data.json', 'utf-8');
    
    if (fileContent.trim() !== '') {
      existingData = JSON.parse(fileContent);
    }

    existingData.push(data);
  
    await fs.writeFile('data.json', JSON.stringify(existingData, null, 2), 'utf-8');
    
    res.json({ message: 'Data saved successfully', data });
  } catch (e) {
    Logger.error(`Server error: ${e}`)
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(Number(configService.get(CONFIG.PORT)), () => {
  Logger.info(`Server is running at http://localhost:${configService.get(CONFIG.PORT)}`);
});

const bot = container.resolve(Bot);
bot.init();
