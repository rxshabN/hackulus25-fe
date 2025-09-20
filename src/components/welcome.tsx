"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AnimatePresence, easeOut, motion } from "framer-motion";
import { useState } from "react";
// import SignInForm from "./auth-forms/signin-form";
import LogInForm from "./auth-forms/login-form";

export default function Welcome() {
  const springTransition = {
    type: "spring" as const,
    damping: 20,
    stiffness: 100,
  };
  // const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isLogInOpen, setIsLogInOpen] = useState(false);

  return (
    <div className="max-h-screen bg-[#fefefe] overflow-hidden relative">
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.5 }}
        >
          <Image src="/vector1.svg" alt="" width={200} height={200} />
        </motion.div>

        <motion.div
          className="absolute top-0 right-0"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.6 }}
        >
          <Image src="/vector2.svg" alt="" width={800} height={800} />
        </motion.div>

        <motion.div
          className="absolute -bottom-32 left-[19%] w-[15.5rem] h-[15.5rem] bg-[#ff7824] rounded-full z-20"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.7 }}
        ></motion.div>

        <motion.div
          className="absolute -bottom-1 right-0"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.8 }}
        >
          <Image src="/vector5.svg" alt="" width={1100} height={500} />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-1/2 w-28 h-28 bg-[#242e6c] rounded-full"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.9 }}
        ></motion.div>
        <motion.div
          className="absolute bottom-48 left-[48%]"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 1.0 }}
        >
          <Image src="/vector4.svg" alt="" width={60} height={60} />
        </motion.div>
        <motion.div
          className="absolute top-0 left-1/3"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 1.1 }}
        >
          <Image src="/vector3.svg" alt="" width={100} height={100} />
        </motion.div>
        <motion.div
          className="absolute top-5 left-[37%]"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 1.2 }}
        >
          <Image src="/vector4.svg" alt="" width={50} height={50} />
        </motion.div>
      </div>

      <div className="relative">
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.7 }}
        >
          <div className="relative w-[31rem] h-[31rem]">
            <Image
              src="/vector6.svg"
              alt=""
              width={900}
              height={900}
              className="absolute top-32 right-96"
            />
            <div className="relative">
              <Image
                src="/final-logo.webp"
                alt="Hackulus Logo"
                width={319}
                height={319}
                className="relative top-[16.5rem] right-[18.5rem]"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="flex-auto gap-y-5"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.9 }}
      >
        <div className="relative left-96 bottom-56 items-center justify-center text-center">
          <h2 className="anta text-6xl lg:text-8xl mb-5 font-black text-[#000000] leading-tight">
            WELCOME TO
            <br />
            HACKULUS
          </h2>

          <div className="space-y-4 mb-8 hanken-grotesk">
            <p className="text-2xl text-[#000000] font-medium">
              Where ideas ignite, <br />
              Code flows, and innovation takes flight. <br />
              24 hours to build, break, and revolutionize!
            </p>
          </div>
          <div className="flex justify-center gap-8">
            {/* <Button
              onClick={() => setIsSignInOpen(true)}
              className="anta bg-gradient-to-r from-[#FF9811] via-[#FE751A] to-[#FC2D2D] text-white font-bold text-2xl px-12 py-6 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              SIGN UP
            </Button> */}
            <Button
              onClick={() => setIsLogInOpen(true)}
              className="anta bg-gradient-to-r from-[#FC2D2D] via-[#FE751A] to-[#FF9811] text-white font-bold text-2xl px-12 py-6 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              LOG IN
            </Button>
          </div>
        </div>
      </motion.div>
      {/* <AnimatePresence>
        {isSignInOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-sm bg-white/60"
              style={{
                backgroundImage: `radial-gradient(circle, #a8a8a7 5px, transparent 1px)`,
                backgroundSize: "90px 90px",
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ ease: easeOut, duration: 0.6 }}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <SignInForm onClose={() => setIsSignInOpen(false)} />
            </div>
          </>
        )}
      </AnimatePresence> */}
      <AnimatePresence>
        {isLogInOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-sm bg-white/60"
              style={{
                backgroundImage: `radial-gradient(circle, #a8a8a7 5px, transparent 1px)`,
                backgroundSize: "90px 90px",
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ ease: easeOut, duration: 0.6 }}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <LogInForm onClose={() => setIsLogInOpen(false)} />
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
