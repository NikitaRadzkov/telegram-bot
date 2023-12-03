import { Context } from "telegraf";

export interface SessionData {
  courseLike: boolean;
  isRegister: boolean;
  chatId: number;
}

export interface IBotContext extends Context {
  session: SessionData;
}