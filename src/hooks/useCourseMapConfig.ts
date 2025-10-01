import { RefObject, useEffect, useState, useCallback } from "react";
import CourseMapConfig from "@/types/CourseMapConfig.type";
import { createCourseMapConfig } from "@/utils/pg";

type Props = {
  imgRef?: RefObject<HTMLImageElement | null>;
  ImageWidth: string;
  ImageHeight: string;
  startPointGPSLat: string;
  startPointGPSLng: string;
  endPointGPSLat: string;
  endPointGPSLng: string;
};

export const useCourseMapConfig = ({
  imgRef,
  ImageWidth,
  ImageHeight,
  startPointGPSLat,
  startPointGPSLng,
  endPointGPSLat,
  endPointGPSLng,
}: Props) => {
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

  // 설정이 완전히 준비되었는지 확인하는 상태
  const [isConfigReady, setIsConfigReady] = useState(false);

  // courseMapConfig를 계산하는 함수
  const calculateConfig = useCallback(() => {
    if (!imgRef?.current || imgRef.current.offsetWidth <= 0 || imgRef.current.offsetHeight <= 0) {
      setIsConfigReady(false);
      return;
    }

    const courseMapConfig = createCourseMapConfig({
      holeOffsetWidth: imgRef.current.offsetWidth, // 이미지가 실제 렌더링된 가로 길이
      holeOffsetHeight: imgRef.current.offsetHeight, // 이미지가 실제 렌더링된 세로 길이
      holeImageWidth: ImageWidth, // 원본 이미지 가로 길이
      holeImageHeight: ImageHeight, // 원본 이미지 세로 길이
      startPointImageX: "0", // 원본 이미지에서 시작 left Pixel 값
      startPointImageY: ImageHeight, // 원본 이미지에서 시작 top Pixel 값
      endPointImageX: ImageWidth, // 원본 이미지에서 끝 left Pixel 값
      endPointImageY: "0", // 원본 이미지에서 끝 top Pixel 값
      startPointGPSLat: startPointGPSLat, // 시작 GPS 위도 값
      startPointGPSLng: startPointGPSLng, // 시작 GPS 경도 값
      endPointGPSLat: endPointGPSLat, // 끝 GPS 위도 값
      endPointGPSLng: endPointGPSLng, // 끝 GPS 경도 값
    });

    // 설정이 유효한지 확인
    const isValid =
      courseMapConfig.renderedWidth > 0 &&
      courseMapConfig.renderedHeight > 0 &&
      courseMapConfig.originalWidth > 0 &&
      courseMapConfig.originalHeight > 0 &&
      courseMapConfig.scalarRatio > 0;

    setConfig(courseMapConfig);
    setIsConfigReady(isValid);
  }, [
    imgRef,
    ImageWidth,
    ImageHeight,
    startPointGPSLat,
    startPointGPSLng,
    endPointGPSLat,
    endPointGPSLng,
  ]);

  useEffect(() => {
    if (!imgRef?.current) return;

    // 이미지가 완전히 로드되고 크기가 정확할 때까지 대기
    const checkImageSize = () => {
      if (imgRef.current && imgRef.current.offsetWidth > 0 && imgRef.current.offsetHeight > 0) {
        calculateConfig();
      } else {
        // 이미지 크기가 아직 준비되지 않았으면 잠시 후 다시 시도
        setTimeout(checkImageSize, 100);
      }
    };

    checkImageSize();

    // ResizeObserver를 사용하여 이미지 크기 변경 감지
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === imgRef.current) {
          // 디바운스를 위해 setTimeout 사용
          setTimeout(() => {
            calculateConfig();
          }, 100);
        }
      }
    });

    // 이미지 요소 관찰 시작
    resizeObserver.observe(imgRef.current);

    // cleanup 함수
    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateConfig]);

  return { config, isConfigReady };
};
