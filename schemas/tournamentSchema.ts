import type { Meta } from "~/schemas/tournament/metaSchema";
import type { Availability } from "./tournament/availabiltySchema";
import type { Holes } from "./tournament/holesSchema";


export interface Tournament
{
  metaData:Meta
  availabiltyData:Availability
  holeData:Holes
  createdAt?:string
  updatedAt?:string
}


