import { type JSONSchemaType } from "ajv";

export interface Meta {
  category: string;
  title: string;
  league: string;
  icon: string;
}

let metaSchema: JSONSchemaType<Meta> = {
  type: "object",
  properties: {
    category: {
      type: "string",
    },
    title: {
      type: "string",
    },
    league: {
      type: "string",
      enum: ["Pro", "Some", "Only potatoes"],
    },
    icon: {
      type: "string",
    },
  },
  required: ["category", "icon", "league", "title"],
};

export default metaSchema;