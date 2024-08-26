import { type JSONSchemaType } from "ajv";

//interfaces
export interface Holes {
  holeCount: number; // Containing the whole number
  holeData: Holes[]; //Containing the whole data
}

// Define the interface for hole data
export interface HoleData {
  courseId: string; // Text field input
  holeId: number; // A single number input through a drop-down
  teePosition: number; // A single number input through a drop-down
  windSpeed: string;
  windDirection: string[]; // Can contain multiple data based on checkboxes
}

// Hole Data Schema
const holeDataSchema: JSONSchemaType<HoleData> = {
  type: "object",
  $id: "#holeDataSchema",
  properties: {
    courseId: {
      type: "string",
      description: "Course ID",
    },
    holeId: {
      type: "number",
      enum: [1, 2, 4],
    },
    teePosition: {
      type: "number",
      description: "Tee position",
    },
    windSpeed: {
      type: "string",
      enum: ["1", "2", "3"],
    },
    windDirection: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string",
        enum: ["foo", "bar", "foobar"], // Define possible values for windDirection
      },
      description: "Wind direction options",
    },
  },
  required: ["courseId", "holeId", "teePosition", "windDirection"],
  additionalProperties: false,
};

const testingHoleScehma: JSONSchemaType<Holes> = {
  type: "object",
  properties: {
    holeCount: {
      type: "number",
      minimum:1
    },
    holeData: {
      type: "array",
      minItems:0,
      items: {
        type: "object",
        // $id: "#holeDataSchema",
        properties: {
          courseId: {
            type: "string",
            description: "Course ID",
          },
          holeId: {
            type: "number",
            enum: [1, 2, 4],
          },
          teePosition: {
            type: "number",
            description: "Tee position",
          },
          windSpeed: {
            type: "string",
            enum: ["1", "2", "3"],
          },
          windDirection: {
            type: "array",
            uniqueItems: true,
            items: {
              type: "string",
              enum: ["foo", "bar", "foobar"], // Define possible values for windDirection
            },
            description: "Wind direction options",
          },
        },
        required: ["courseId", "holeId", "teePosition", "windDirection"],
      },
    },
  },
  required: ["holeCount", "holeData"],
};

const holeSchemaForUi: JSONSchemaType<Holes> = {
  type: "object",
  properties: {
    holeCount: {
      type: "number",
    },
  },
  required: ["holeCount"],
};

//New Hole Schema for testing purpose
const holeSchema: JSONSchemaType<Holes> = {
  type: "object",
  $id: "#HoleSchema",
  properties: {
    holeCount: {
      type: "number",
    },
    holeData: {
      type: "array",
      minItems: 0,
      maxItems:1000,
      items: {
        $ref: "#holeDataSchema",
      },
    },
  },
  required: ["holeCount", "holeData"],
};

export { holeDataSchema, holeSchemaForUi, testingHoleScehma };
export default holeSchema;
