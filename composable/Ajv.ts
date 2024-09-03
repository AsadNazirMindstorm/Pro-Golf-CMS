import {type Tournament} from '~/schemas/tournamentSchema'
import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  AvailabilitySchema,
  type Availability,
} from "~/schemas/tournament/availabiltySchema";
import holeSchema, {
  holeDataSchema,
  testingHoleScehma,
  type HoleData,
  type Holes,
} from "~/schemas/tournament/holesSchema";
import { metadata } from '@vueuse/core/metadata.cjs';
import metaSchema from '~/schemas/tournament/metaSchema';

// Initialize AJV instance
const ajv = new Ajv().addSchema([holeDataSchema, holeSchema]);

//add date-time formats
addFormats(ajv, ["date-time", "uuid"]);

// Define a composable function to validate data against a schema
export function useAjv() {
  // Compile the schema
  const compileSchema = (schema: object) => {
    return ajv.compile(schema);
  };

  // Validate data against a schema
  const validate = (schema: object, data: any): boolean => {
    const validateFunction = compileSchema(schema);
    const valid = validateFunction(data);
    if (!valid) {
      // console.error("Validation errors:", validateFunction.errors);
    }
    return valid;
  };

  //custom hole form validator function
  function validateHoleForm(data: Holes) {
    const isValid = validate(testingHoleScehma, data);
    if (!isValid) return false;

    //if our hole count is greater than the length of hole data return false
    //if it is not random than hole count must be equal to number of hole data
    if (
      data.holeCount > data?.holeData.length ||
      (data.isRandom == false && data.holeCount != data?.holeData.length)
    )
      return false;

    return true;
  }

  function validateAvailabiltyFormData(data: Availability) {
    const isValid = validate(AvailabilitySchema, data);

    if (!isValid) return false;
    if (new Date(data.startDateTime) >= new Date(data.endDateTime))
      return false;

    return true;
  }

  function validateTournament(data:Tournament)
  {
    if(!validateHoleForm(data.holeData) || !validateAvailabiltyFormData(data.availabiltyData) || !validate(metaSchema,data.metaData))
      return false

    return true;
  }

  // Return the validate function and AJV instance
  return {
    validate,
    ajv,
    validateHoleForm,
    validateAvailabiltyFormData,
    validateTournament
  };
}
