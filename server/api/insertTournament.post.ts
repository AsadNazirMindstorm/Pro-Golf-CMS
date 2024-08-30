import { useAjv } from "~/composable/Ajv";
import tournamentDAO from "~/DAO/tournamentDAO";
import { ServerResponse } from "~/schemas/responseSchema";
import { AvailabilitySchema } from "~/schemas/tournament/availabiltySchema";
import holeSchema from "~/schemas/tournament/holesSchema";
import metaSchema from "~/schemas/tournament/metaSchema";
import { Tournament } from "~/schemas/tournamentSchema";

export default defineEventHandler(async (event) => {
  //use AJV here to valiadte

  let serverResponse: ServerResponse;
  try {
    const body: Tournament = await readBody(event);

    //schema validation on server side
    if (!useAjv().validate(metaSchema, body.metaData)) {
      throw new Error("Meta Data is not correct");
    }
    if (!useAjv().validate(AvailabilitySchema, body.availabiltyData))
      throw new Error("Availabilty Data is not correct");
    if (!useAjv().validateHoleForm(body.holeData))
      throw new Error("Hole Data is not correct");

    //returning the id after inserting
    const id = await tournamentDAO.insertTournament(body);

    //Succesfully return the Id created at the database
    return (serverResponse = {
      success: true,
      data: id,
    });
  } catch (error: any) {
    setResponseStatus(event, 503);
    //console.log(error);
    //error response
    return (serverResponse = {
      success: false,
      message: error,
    });
  }

  //valiadation
});
