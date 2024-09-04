import { CHANGE_LOG_TABLE } from "~/constants/table";
import { db } from "~/database/db";

class ChanglogDAO {
  async enterChangeLog(data: Changelog) {
    try {
      const res = await db
        .table(CHANGE_LOG_TABLE)
        .insert({
          action: data.action,
          old_data: JSON.stringify(data.old_data),
          new_data: JSON.stringify(data.new_data),
          tournament_id: data.tournament_id,
        })
        .returning("*");
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async getAll(limit: number, offset: number, search: string) {
    try {
      const results = await db
        .table(CHANGE_LOG_TABLE)
        .select("*")
        .orderBy("id", "desc")
        .limit(limit, { skipBinding: true })
        .offset(offset, { skipBinding: true });

      console.log(results);
      return results;
    } catch (error: any) {
      console.log(error);
    }
  }
}

export interface Changelog {
  id?: number;
  title?: string;
  action: string;
  tournament_id: string;
  old_data: Object;
  new_data: Object;
}

export default new ChanglogDAO();
