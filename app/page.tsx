"use client";

import { useState } from "react";
import SmoothScroll from "@/components/core/SmoothScroll";
import Cursor from "@/components/core/Cursor";
import NavBar from "@/components/core/NavBar";
import EasterEggs from "@/components/core/EasterEggs";
import { ScrollProgress } from "@/components/core/Motion";
import Intro from "@/components/intro/Intro";
import Hero from "@/components/hero/Hero";
import WhatIs from "@/components/sections/WhatIs";
import Journey from "@/components/sections/Journey";
import Failure from "@/components/sections/Failure";
import Ecosystem from "@/components/sections/Ecosystem";
import IdeaMachine from "@/components/sections/IdeaMachine";
import MadeHere from "@/components/sections/MadeHere";
import Events from "@/components/sections/Events";
import Manifesto from "@/components/sections/Manifesto";
import FindYourPath from "@/components/sections/FindYourPath";
import FinalAct from "@/components/sections/FinalAct";

export default function Page() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <EasterEggs />
      <Intro onEnter={() => setReady(true)} />
      <NavBar ready={ready} />
      <main className="relative">
        <Hero />
        <WhatIs />
        <Journey />
        <Failure />
        <Ecosystem />
        <IdeaMachine />
        <MadeHere />
        <Events />
        <Manifesto />
        <FindYourPath />
        <FinalAct />
      </main>
    </>
  );
}
