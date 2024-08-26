import { useAjv } from "~/composable/Ajv";
import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";
import { AvailabilitySchema } from "~/schemas/tournament/availabiltySchema";
import holeSchema from "~/schemas/tournament/holesSchema";
import metaSchema from "~/schemas/tournament/metaSchema";
import { Tournament } from "~/schemas/tournamentSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;
  try {
    const body: Tournament = await readBody(event);

    if (!useAjv().validate(metaSchema, body.metaData))
      throw new Error("Meta Form Error");
    if (!useAjv().validate(AvailabilitySchema, body.availabiltyData))
      throw new Error("Availabilty Data is wrong");
    if (!useAjv().validate(holeSchema, body.holeData))
      throw new Error("Holes are incorrect");

    const res = await tournamentDAO.createCopy(body);

    return (serverResponse = {
      success: true,
      data: res,
    });
  } catch (error: any) {
    return (serverResponse = {
      success: false,
      message: error,
    });
  }
});
