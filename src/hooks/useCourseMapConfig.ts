import { RefObject, useEffect, useState } from "react";
import CourseMapConfig from "@/types/CourseMapConfig.type";
import { createCourseMapConfig } from "@/utils/pg";

type Props = {
  imgRef?: RefObject<HTMLImageElement | null>;
};

export const useCourseMapConfig = ({ imgRef }: Props) => {
  const [config, setConfig] = useState<CourseMapConfig>({
    ratioX: 1,
    ratioY: 1,
    yard: 1,
    tmStartX: 1,
    tmStartY: 1,
    tmEndX: 1,
    tmEndY: 1,
    imgStartX: 1,
    imgStartY: 1,
    cos: 1,
    sin: 1,
    scalarRatio: 1,
    originalWidth: 1920,
    originalHeight: 1200,
    renderedWidth: 1920,
    renderedHeight: 1200,
  });

  useEffect(() => {
    if (!imgRef?.current) return;

    const courseMapConfig = createCourseMapConfig({
      holeOffsetWidth: imgRef.current.offsetWidth, // 이미지가 실제 렌더링된 가로 길이
      holeOffsetHeight: imgRef.current.offsetHeight, // 이미지가 실제 렌더링된 세로 길이
      holeImageWidth: "1920", // 원본 이미지 가로 길이
      holeImageHeight: "1200", // 원본 이미지 세로 길이
      startPointImageX: "0", // 원본 이미지에서 시작 left Pixel 값
      startPointImageY: "1200", // 원본 이미지에서 시작 top Pixel 값
      endPointImageX: "1920", // 원본 이미지에서 끝 left Pixel 값
      endPointImageY: "0", // 원본 이미지에서 끝 top Pixel 값
      startPointGPSLat: "36.69950311400381", // 시작 GPS 위도 값
      startPointGPSLng: "126.30574014913672", // 시작 GPS 경도 값
      endPointGPSLat: "36.68885494290464", // 끝 GPS 위도 값
      endPointGPSLng: "126.34114783337701", // 끝 GPS 경도 값
    });

    setConfig(courseMapConfig);
  }, [imgRef]);

  return { config };
};
