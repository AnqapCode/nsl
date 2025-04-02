"use client";

import React from "react";
import { AuroraBackground } from "../ui/aurora-background";
import { motion } from "framer-motion";
import { ContainerTextFlip } from "../ui/container-text-flip";
import { FlipWords } from "../ui/flip-words";
import Link from "next/link";

const LandingHome = () => {
  return (
    <AuroraBackground id="home">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-2xl md:text-6xl font-bold dark:text-white text-center">Selamat Datang di website kami</div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Disini kalian bisa
          <FlipWords words={["Check Link", "Custom Link", "Simpan Link", "Pantau Link"]} className="font-medium" />
          {/* <span>
            <ContainerTextFlip words={["Periksa Link", "Simpan Link", "Pantau Link"]} />
          </span> */}
        </div>
        <Link href={"#check-link"}>
          <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-10 py-2">Start</button>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
};

export default LandingHome;
