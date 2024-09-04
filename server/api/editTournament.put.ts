import changlogDAO, { Changelog } from "~/DAO/changlogDAO";
import tournamentDAO from "~/DAO/tournamentDAO";
import Changelogs from "~/pages/dashboard/changelogs.vue";
import { ServerResponse } from "~/schemas/responseSchema";
import { Tournament } from "~/schemas/tournamentSchema";

export default defineEventHandler(async (event) => {
  let serverResponse: ServerResponse;
  try {
    const body: Tournament = await readBody(event);

    //get the old data from the tournament_id to
    const oldTournamentData: Tournament[] = await tournamentDAO.getTournament(
      body.metaData.category
    );

    //const get th created at Date
    //delete the prvious object it will be a cascade delete so hole data will also be deleted
    const delRes = await tournamentDAO.deleteTournament(body.metaData.category);

    //put in the new record through the insert :) jugad ha  ik but it works i wrote it in 15 min
    const insertRes = await tournamentDAO.insertTournament(body, true);

    //Data that is going to be placed in the Change Log
    const oldDataToBeInsertedIntoChangeLogs:Tournament={
      metaData:oldTournamentData[0].metaData,
      availabiltyData:oldTournamentData[0].availabiltyData,
      holeData:oldTournamentData[0].holeData,
      pushedToNakama:oldTournamentData[0].pushedToNakama
    }

    //ChangeLog Record
    const changelogRecord: Changelog = {
      tournament_id: body.metaData.category,
      old_data: oldDataToBeInsertedIntoChangeLogs,
      new_data: body,
      action: "EDIT",
    };

    const changeLogRes = await changlogDAO.enterChangeLog(changelogRecord);

    // console.log(changeLogRes);

    return (serverResponse = {
      success: true,
      data: insertRes,
    });
  } catch (error: any) {
    console.log()
    return (serverResponse = {
      success: false,
      message: error,
    });
  }
});
