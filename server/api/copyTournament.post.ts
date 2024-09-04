import { useAjv } from "~/composable/Ajv";
import changlogDAO, { Changelog } from "~/DAO/changlogDAO";
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
    if (!useAjv().validateHoleForm(body.holeData))
      throw new Error("Holes are incorrect");

    //set the status of the new tournament tp false
    body.pushedToNakama = false;

    //then store it
    const res = await tournamentDAO.createCopy(body);

    //change log data to be inserted
    const newDataToBeInsertedIntoTheChangeLogs: Tournament = {
      metaData: body.metaData,
      availabiltyData: body.availabiltyData,
      holeData: body.holeData,
      pushedToNakama: body.pushedToNakama,
    };

    //ChangeLog Record
    const changelogRecord: Changelog = {
      tournament_id: body.metaData.category,
      old_data: {},
      new_data: newDataToBeInsertedIntoTheChangeLogs,
      action: "DUPLICATE",
    };

    const changeLogRes = await changlogDAO.enterChangeLog(changelogRecord);

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
