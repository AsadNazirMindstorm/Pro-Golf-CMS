import { type JSONSchemaType } from "ajv";

//interfaces
export interface Holes {
  holeCount: number; // Containing the whole number
  holeData: HoleData[]; //Containing the whole data
  isRandom: boolean;
}

// Define the interface for hole data
export interface HoleData {
  courseId: string; // Text field input
  holeId: number; // A single number input through a drop-down
  teePosition: string; // A single number input through a drop-down
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
      enum: [1, 2, 3, 4, 5, 6],
    },
    teePosition: {
      type: "string",
      enum: ["1", "2", "3"],
    },
    windSpeed: {
      type: "string",
      enum: ["1 kmph", "2 kmph", "3 kmph"],
    },
    windDirection: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string",
        enum: ["North", "West", "East", "South"], // Define possible values for windDirection
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
      minimum: 1,
    },
    isRandom: {
      type: "boolean",
      default: false,
    },
    holeData: {
      type: "array",
      minItems: 0,
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
            enum: [1, 2, 3, 4, 5, 6],
          },
          teePosition: {
            type: "string",
            enum: ["1", "2", "3"],
          },
          windSpeed: {
            type: "string",
            enum: ["1 kmph", "2 kmph", "3 kmph"],
          },
          windDirection: {
            type: "array",
            uniqueItems: true,
            items: {
              type: "string",
              enum: ["North", "West", "East", "South"], // Define possible values for windDirection
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
    isRandom: {
      type: "boolean",
      default: false,
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
      minItems: 1,
      maxItems: 1000,
      items: {
        $ref: "#holeDataSchema",
      },
    },
  },
  required: ["holeCount", "holeData"],
};

export { holeDataSchema, holeSchemaForUi, testingHoleScehma };
export default holeSchema;
