import proj4 from "proj4";
import Coordinates from "@/types/Coordinates.type";
import CourseMapConfigParams from "@/types/CourseMapConfigParams.type";
import CourseMapConfig from "@/types/CourseMapConfig.type";

export const geodetic = ({ longitude, latitude }: Coordinates) => {
  const lng = longitude;
  const lat = latitude;

  const hemisphere = lat > 0 ? 32600 : 32700;
  const zone = 1 + Math.floor((lng + 180) / 6);

  return {
    long: lng,
    lat: lat,
    wgs: "WGS84",
    epsg: `${hemisphere + zone}`, // EPSG: 제거
    zone,
  };
};

export const utm = ({ longitude, latitude }: Coordinates) => {
  const { long, lat, wgs, epsg, zone } = geodetic({ longitude, latitude });
  proj4.defs(epsg, `+proj=utm +zone=${zone} +datum=WGS84 ${lat < 0 ? "+south" : ""}`);
  proj4.defs(wgs, `+proj=longlat +datum=WGS84 +no_defs`);

  const [x, y] = proj4(wgs, epsg, [long, lat]);

  return { x, y };
};

export const createCourseMapConfig = ({
  holeOffsetWidth,
  holeOffsetHeight,
  holeImageWidth,
  holeImageHeight,
  startPointImageX,
  startPointImageY,
  endPointImageX,
  endPointImageY,
  startPointGPSLat,
  startPointGPSLng,
  endPointGPSLat,
  endPointGPSLng,
}: CourseMapConfigParams) => {
  // ✅ 원본 → 렌더링 비율
  const ratioX = holeOffsetWidth / parseFloat(holeImageWidth);
  const ratioY = holeOffsetHeight / parseFloat(holeImageHeight);

  // ✅ 시작/끝 픽셀 좌표 값 원본
  const imgStartX = parseFloat(startPointImageX);
  const imgStartY = parseFloat(startPointImageY);
  const imgEndX = parseFloat(endPointImageX);
  const imgEndY = parseFloat(endPointImageY);

  // ✅ 시작/끝 GPS 좌표 값
  const startLat = parseFloat(startPointGPSLat);
  const startLng = parseFloat(startPointGPSLng);
  const endLat = parseFloat(endPointGPSLat);
  const endLng = parseFloat(endPointGPSLng);

  // ✅ 시작/끝 UTM 좌표 값
  const { x: tmStartX, y: tmStartY } = utm({ longitude: startLng, latitude: startLat });
  const { x: tmEndX, y: tmEndY } = utm({ longitude: endLng, latitude: endLat });

  // ✅ UTM ↔ 이미지 벡터 비교
  const pxDistX = imgEndX - imgStartX;
  const pxDistY = -imgEndY - -imgStartY;
  const tmDistX = tmEndX - tmStartX;
  const tmDistY = tmEndY - tmStartY;

  // ✅ 회전 보정
  const degree =
    (Math.atan2(pxDistY, pxDistX) * 180) / Math.PI - (Math.atan2(tmDistY, tmDistX) * 180) / Math.PI;
  const cos = Math.cos((degree * Math.PI) / 180);
  const sin = Math.sin((degree * Math.PI) / 180);

  // ✅ 스케일 비율 (px/UTM)
  const tmHypotenuse = Math.sqrt(tmDistX ** 2 + tmDistY ** 2);
  const pixelHypotenuse = Math.sqrt(pxDistX ** 2 + pxDistY ** 2);
  const scalarRatio = pixelHypotenuse / tmHypotenuse;

  return {
    ratioX,
    ratioY,
    yard: 1.094,
    imgStartX,
    imgStartY,
    tmStartX,
    tmStartY,
    tmEndX,
    tmEndY,
    cos,
    sin,
    scalarRatio,
    originalWidth: parseFloat(holeImageWidth),
    originalHeight: parseFloat(holeImageHeight),
    renderedWidth: holeOffsetWidth,
    renderedHeight: holeOffsetHeight,
  };
};

export const gpsToPx = ({ latitude, longitude }: Coordinates, configState: CourseMapConfig) => {
  const { x: tmX, y: tmY } = utm({ latitude, longitude });

  const vectorX = tmX - configState.tmStartX;
  const vectorY = tmY - configState.tmStartY;

  let rotationX = vectorX * configState.cos - vectorY * configState.sin;
  let rotationY = vectorX * configState.sin + vectorY * configState.cos;

  rotationX *= configState.scalarRatio;
  rotationY *= configState.scalarRatio;

  const x = rotationX + configState.imgStartX;
  const y = -1 * (-1 * configState.imgStartY + rotationY);

  return {
    // (원본 좌표 / 원본 이미지 길이) * 렌더링된 이미지의 길이
    x: (x / configState.originalWidth) * configState.renderedWidth,
    y: (y / configState.originalHeight) * configState.renderedHeight,
  };
};
