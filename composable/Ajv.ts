import Ajv from "ajv"

// Initialize AJV instance
const ajv = new Ajv();

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
      console.error('Validation errors:', validateFunction.errors);
    }
    return valid;
  };

  // Return the validate function and AJV instance
  return {
    validate,
    ajv
  };
}