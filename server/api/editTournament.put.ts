import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";
import { Tournament } from "~/schemas/tournamentSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;
  try {
    const body: Tournament = await readBody(event);

    //const get th created at Date
    //delete the prvious object it will be a cascade delete so hole data will also be deleted
    const delRes = await tournamentDAO.deleteTournament(body.metaData.category);

    //put in the new record through the insert :) jugad ha  ik but it works i wrote it in 15 min
    const insertRes = await tournamentDAO.insertTournament(body,true);

    return (serverResponse = {
      success: true,
      data: insertRes,
    });
  } catch (error: any) {
    return (serverResponse = {
      success: false,
      message: error,
    });
  }
});
