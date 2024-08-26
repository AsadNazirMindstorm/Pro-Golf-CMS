import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;

  try {
    const data = await tournamentDAO.getAll();
    return (serverResponse = {
      success: true,
      data: data,
    });
  } catch (error) {
    return (serverResponse = {
      success: false,
      message: error,
    });
  }
});
