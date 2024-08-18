import { User, userSchema } from "~/schemas/userSchema";
import Ajv from "ajv";

const ajv = new Ajv();

export default defineEventHandler(async (event) => {
  // Read the request body
  const body: User = await readBody(event);

  // Extract email and password from the body
  const { email, password } = body;
  const validate = ajv.compile(userSchema);

  if (validate(body)) {
    return {
      status: "success",
      email,
      password,
    };
  } else {
    setResponseStatus(event,500,"Invalid Payload")
    return {
      status: "failed",
    };
  }
});
