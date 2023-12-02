import { Actions } from './actions';
import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start((ctx) => {
      console.log(ctx.session);
      ctx.reply("Do you like course?", Markup.inlineKeyboard([
        Markup.button.callback("👍",  Actions.course_like),
        Markup.button.callback("👎",  Actions.course_dislike) 
      ]));
    });

    this.bot.action(Actions.course_like, (ctx) => {
      ctx.session.courseLike = true;
      ctx.editMessageText("Cool!");
    });

    this.bot.action(Actions.course_dislike, (ctx) => {
      ctx.session.courseLike = false;
      ctx.editMessageText("Sad");
    });
  }
}
