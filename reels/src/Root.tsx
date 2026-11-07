import React from "react";
import { Composition } from "remotion";
import { Reel01Dikkat, REEL01_FRAMES } from "./reels/Reel01Dikkat";

export const Root: React.FC = () => (
  <>
    <Composition
      id="Reel01-Dikkat"
      component={Reel01Dikkat}
      durationInFrames={REEL01_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
