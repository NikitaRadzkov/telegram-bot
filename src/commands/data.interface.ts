export interface DataJSON {
  status: string,
  geo: string,
  ref_id: number,
  order_sum: number
}

export interface SessionsJSON {
  sessions: SessionJSON[]
}

export interface SessionJSON {
  id: string,
  data: {
    chatId: number,
    is_clicked_register: boolean,
    ref_id: number
  }
}
