import Ajv from "ajv";
import holeSchema, {
  holeDataSchema,
  Holes,
  testingHoleScehma,
} from "~/schemas/tournament/holesSchema";

const ajv = new Ajv();

export default defineEventHandler(async (event) => {

  const body: Holes = await readBody(event);
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

    return {
      status: "success",
      payload: body,
    };
  } catch (e: any) {
    console.log(e);
    return {
      status: "failed",
      payload: body,
      message: e,
    };
  }
});
