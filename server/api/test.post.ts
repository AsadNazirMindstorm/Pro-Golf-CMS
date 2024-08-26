import Ajv from "ajv";
import { TOURNAMENT_TABLE_NAME } from "~/constants/table";
import tournamentDAO from "~/DAO/tournamentDAO";
import { db } from "~/database/db";
import holeSchema, {
  holeDataSchema,
  Holes,
  testingHoleScehma,
} from "~/schemas/tournament/holesSchema";

const ajv = new Ajv();

export default defineEventHandler(async (event) => {
  //const body: Holes = await readBody(event);
  try {
    // if (validate == undefined)
    //   return { status: "Failed validate was undefined" };

    // if (validate(body)) {
    //   return {
    //     status: "success",
    //     payload: body,
    //   };
    // } else {
    //   setResponseStatus(event, 500, "Invalid Payload");
    //   return {
    //     status: "failed",
    //     payload: body,
    //   };
    // }

    // const res = await tournamentDAO.insertTournament();

    return {
      status: "success",
      // payload: res,
    };
  } catch (e: any) {
    // console.log(e);
    return {
      status: "failed",
      message: e,
    };
  }
});
