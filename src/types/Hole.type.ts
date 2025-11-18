import MapType from "@/types/Map.type";

type HoleType = {
  holeId: number;
  holeNo: number;
  holeAvg: number;
  holePar: number;
  holeHdc: number;
  holeAlt: number;
  holePer: string;
  holeWth: number; //홀 너비
  holeGap: number; //홀간 거리
  mapList: MapType[];
};

export default HoleType;
