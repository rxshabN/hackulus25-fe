"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { easeOut, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { toast } from "sonner";

interface LogInFormProps {
  onClose: () => void;
}

export default function LogInForm({ onClose }: LogInFormProps) {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      toast.error("Hackathon has ended. Login is disabled.");
      setIsSubmitting(false);
      console.error("Login error:", error);
    }
  };

  return (
    <motion.div
      className="w-full p-8 rounded-2xl shadow-2xl afacad"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: "0%" }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ ease: easeOut, duration: 0.8, delay: 0.2 }}
    >
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-xl p-10 rounded-2xl shadow-2xl border-r-8 border-b-8 border-black bg-gradient-to-b from-[#010027] via-[#13184E] to-[#3142B4]">
          <div className="text-left mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">LOG IN</h1>
            <p className="text-white/80 text-xl">
              Welcome back young padawan! Let&apos;s get you logged in.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
              {errors.email && (
                <p className="text-red-400 mt-1 text-sm flex items-center">
                  <Info className="w-4 h-4 mr-1" /> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
              {errors.password && (
                <p className="text-red-400 mt-1 text-sm flex items-center">
                  <Info className="w-4 h-4 mr-1" /> {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                onClick={onClose}
                className="text-3xl p-5 rounded-lg font-medium bg-[#3142b4] hover:bg-[#3142b4] border-r-4 border-b-4 border-black"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-3xl border-r-4 border-b-4 border-black bg-white text-gray-800 p-5 rounded-lg font-medium hover:bg-gray-100"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
