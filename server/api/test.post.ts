import Ajv from "ajv";
import {
  holeDataSchema,
  Holes,
  newHoleSchema,
} from "~/schemas/tournament/holesSchema";

const ajv = new Ajv({schemas:[newHoleSchema,holeDataSchema]});

export default defineEventHandler(async (event) => {
  // Read the request body
  const validate = ajv.compile(newHoleSchema);

  const body: Holes = await readBody(event);
  try {
    if (validate == undefined)
      return { status: "Failed validate was undefined" };

    if (validate(body)) {
      return {
        status: "success",
        payload: body,
      };
    } else {
      setResponseStatus(event, 500, "Invalid Payload");
      return {
        status: "failed",
        payload: body,
      };
    }
  } catch (e: any) {
    console.log(e);
    return {
      status: "failed",
      payload: body,
      message: e,
    };
  }
});
