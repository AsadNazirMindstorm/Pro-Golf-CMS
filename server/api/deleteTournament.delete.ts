import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;

  try {
    const body: any = await readBody(event);
    const id:string = body.id;

    const res = await tournamentDAO.deleteTournament(id);

    return serverResponse= {
      success:true,
      data:res
    }
  } catch (error: any) {
    console.log(error);

    return serverResponse={
      success:false,
      message:error
    }
  }

  const body: string = await readBody(event);
});
