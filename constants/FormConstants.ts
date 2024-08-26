import type { Availability } from "~/schemas/tournament/availabiltySchema";
import type { HoleData, Holes } from "~/schemas/tournament/holesSchema";
import type { Meta } from "~/schemas/tournament/metaSchema";

export const defaultMetaFormData: Meta = {
  league: "Change Me",
  title: "Change Me",
  icon: "1",
  category: "Chane Me",
};

export const defaultAvailabiltyFormData:Availability =
{
  startDateTime:"2019-08-22T15:30:00Z",
  endDateTime:"2020-08-22T15:30:00Z",
  userPlayTime:300,
  totalTime:600
}

export const defualtHoleFormData:Holes ={
  holeCount:-1,
  holeData:[]
}

export const defaultHoleData:HoleData={
    courseId:"Change Me",
    holeId:-1,
    teePosition:-1,
    windDirection:[],
    windSpeed:"Change Me"
}

export const tournamentIconsArrays: Object[] = [
  { name: "whatever", img: "https://i.ibb.co/wJXZ38g/pngwing-com-1.png" },
  {
    name: "whatever",
    img: "https://i.ibb.co/HzDPrHP/pngwing-com-3.png",
  },
  {
    name: "whatever",
    img: "https://i.ibb.co/MVw4z9q/pngwing-com-4.png",
  },
  {
    name: "whatever",
    img: "https://i.ibb.co/hgLKS6X/pngwing-com-5.png",
  },
  {
    name: "whatever",
    img: "https://i.ibb.co/LNB5CH2/pngwing-com.png",
  },
  {
    name: "whatever",
    img: "https://i.ibb.co/mHHRMRf/us-Open-tournament.png",
  },
];
