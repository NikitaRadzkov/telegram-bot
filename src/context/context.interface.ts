import { Context } from "telegraf";

export enum GEO {
  MEXICO = "MEXICO",
  COLUMBIA = "COLUMBIA",
  CHILE = "CHILE",
  ECUADOR = "ECUADOR",
  PERU = "PERU"
}

export interface SessionData {
  is_register: boolean;
  is_clicked_register: boolean;
  geo: GEO;
  bot_link: string,
  telegram_channel_link: string,
  is_deposit: boolean;
  chat_id: number;
  ref_id: number;
}

export interface IBotContext extends Context {
  session: SessionData;
}