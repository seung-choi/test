import { useEffect, useRef, useState } from "react";

interface AutoFontSizeTextProps {
  text: string;
  maxFontSize?: number; // px 단위
  minFontSize?: number; // px 단위
}

const AutoFontSizeText: React.FC<AutoFontSizeTextProps> = ({
                                                             text,
                                                             maxFontSize = 24,
                                                             minFontSize = 10,
                                                           }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const resizeText = () => {
      if (!containerRef.current || !textRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      let currentFontSize = maxFontSize;

      textRef.current.style.fontSize = `${currentFontSize}px`;

      while (
        textRef.current.scrollWidth > containerWidth &&
        currentFontSize > minFontSize
        ) {
        currentFontSize -= 1;
        textRef.current.style.fontSize = `${currentFontSize}px`;
      }

      setFontSize(currentFontSize);
    };

    resizeText();

    const resizeObserver = new ResizeObserver(resizeText);
    resizeObserver.observe(containerRef.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, [text, maxFontSize, minFontSize]);

  return (
    <div ref={containerRef} className="auto-font-size-content">
      <span
        ref={textRef}
        style={{ fontSize: `${fontSize}px` }}
      >
        {text}
      </span>
    </div>
  );
};

export default AutoFontSizeText;