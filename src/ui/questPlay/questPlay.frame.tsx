import * as React from "react";

interface FrameBorderProps {
  frameBorderX: number;
  frameBorderY: number;
}

function getFrameSize({ frameBorderX, frameBorderY }: FrameBorderProps) {
  const frameWidth = frameBorderX * 2;
  const frameHeight = frameBorderY * 2;
  return { frameWidth, frameHeight };
}

export const QuestPlayFrameImage: React.FC<
  {
    fitHeight: boolean;
  } & FrameBorderProps
> = ({ children, fitHeight, frameBorderX, frameBorderY }) => {
  return (
    <div
      style={{
        width: "100%",
        height: fitHeight ? "100%" : undefined,
        position: "relative",
      }}
    >
      <div
        style={{
          paddingLeft: frameBorderX,
          paddingTop: frameBorderY,
          paddingRight: frameBorderX,
          paddingBottom: frameBorderY,
          height: fitHeight ? "100%" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * It renders children over the frame. This is needed for scroll to work
 */
export const QuestPlayFrameText: React.FC<
  {
    fitHeight: boolean;
  } & FrameBorderProps
> = ({ children, fitHeight, frameBorderX, frameBorderY }) => {
  const { frameWidth, frameHeight } = getFrameSize({ frameBorderX, frameBorderY });

  return (
    <div
      style={{
        height: fitHeight ? "100%" : undefined,
        width: "100%",
        position: "relative",
        minHeight: 100,
      }}
    >
      <div
        style={{
          paddingLeft: frameWidth,
          paddingRight: frameWidth,
          paddingTop: frameHeight,
          paddingBottom: frameHeight,
          position: "relative",
          height: fitHeight ? "100%" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};
