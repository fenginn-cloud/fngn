import React from "react";
import { Composition } from "remotion";
import { Reel01Dikkat, REEL01_FRAMES } from "./reels/Reel01Dikkat";
import { Reel02Formul, REEL02_FRAMES } from "./reels/Reel02Formul";
import { Reel03Marka, REEL03_FRAMES } from "./reels/Reel03Marka";
import { Reel04Yol, REEL04_FRAMES } from "./reels/Reel04Yol";

const common = { fps: 30, width: 1080, height: 1920 } as const;

export const Root: React.FC = () => (
  <>
    <Composition id="Reel01-Dikkat" component={Reel01Dikkat} durationInFrames={REEL01_FRAMES} {...common} />
    <Composition id="Reel04-Yol" component={Reel04Yol} durationInFrames={REEL04_FRAMES} {...common} />
    <Composition id="Reel03-Marka" component={Reel03Marka} durationInFrames={REEL03_FRAMES} {...common} />
    <Composition id="Reel02-Formul" component={Reel02Formul} durationInFrames={REEL02_FRAMES} {...common} />
  </>
);
