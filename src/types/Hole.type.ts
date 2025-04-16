import MapType from "@/types/Map.type";

type HoleType = {
  holeId: number;
  holeNo: number;
  holeAvg: number;
  holePar: number;
  holeHdc: number;
  holeAlt: number;
  holePer: string;
  mapList: MapType[];
};

export default HoleType;
