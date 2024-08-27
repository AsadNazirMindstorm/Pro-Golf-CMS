import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";
import { Tournament } from "~/schemas/tournamentSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;
  try {
    const body: any = await getQuery(event);

    const id = body.id;

    const res: Tournament = await tournamentDAO.getTournament(id);

    return (serverResponse = {
      success: true,
      data: res,
    });
  } catch (error: any) {
    console.log(error);
    //setResponseStatus(event, 503);
    return (serverResponse = {
      success: false,
      message: error,
    });
  }
});
