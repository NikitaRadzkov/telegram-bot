import { Context } from "telegraf";

export interface SessionData {
  is_register: boolean;
  is_clicked_register: boolean;
  is_deposit: boolean;
  chat_id: number;
  ref_id: number;
}

export interface IBotContext extends Context {
  session: SessionData;
}