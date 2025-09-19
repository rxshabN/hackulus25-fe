"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { easeOut, motion } from "framer-motion";

interface SignInFormProps {
  onClose: () => void;
}

export default function SignInForm({ onClose }: SignInFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    password: "",
    phoneNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    onClose();
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
            <h1 className="text-4xl font-bold text-white mb-2">SIGN IN</h1>
            <p className="text-white/80 text-xl">
              Hey there! Let's get you signed in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3  placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Registration Number
              </label>
              <Input
                type="text"
                placeholder="Enter your registration number"
                value={formData.registrationNumber}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                onClick={handleCancel}
                className="text-3xl p-5 rounded-lg font-medium bg-[#3142b4] hover:bg-[#3142b4] border-r-4 border-b-4 border-black"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-3xl border-r-4 border-b-4 border-black bg-white text-gray-800 p-5 rounded-lg font-medium hover:bg-gray-100"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
