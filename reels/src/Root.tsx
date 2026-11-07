import React from "react";
import { Composition } from "remotion";
import { Reel01Dikkat, REEL01_FRAMES } from "./reels/Reel01Dikkat";
import { Reel02Formul, REEL02_FRAMES } from "./reels/Reel02Formul";

const common = { fps: 30, width: 1080, height: 1920 } as const;

export const Root: React.FC = () => (
  <>
    <Composition id="Reel01-Dikkat" component={Reel01Dikkat} durationInFrames={REEL01_FRAMES} {...common} />
    <Composition id="Reel02-Formul" component={Reel02Formul} durationInFrames={REEL02_FRAMES} {...common} />
  </>
);
