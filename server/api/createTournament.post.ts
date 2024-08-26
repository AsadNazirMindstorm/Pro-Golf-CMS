import { db } from "~/database/db";
import { ServerResponse } from "~/schemas/responseSchema";
import { Tournament } from "~/schemas/tournamentSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;
  try {
    //get the tournament data
    // const body: Tournament = await readBody(event);

    //getting all the data
    const resposne = await db
      .table(TOURNAMENT_TABLE_NAME)
      .select("*")
      .returning("*");

    return (serverResponse = {
      success: true,
      data: resposne,
    });
  } catch (e: any) {
    return (serverResponse = {
      success: true,
      message:e.message,
    });
  }

  return "Hello Nitro";
});
