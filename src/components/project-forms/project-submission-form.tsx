"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { easeOut, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ProjectFormData, projectSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { toast } from "sonner";
import { Info } from "lucide-react";

interface ProjectSubmissionFormProps {
  onClose: () => void;
  reviewStage: string;
}

export default function ProjectSubmissionForm({
  onClose,
  reviewStage,
}: ProjectSubmissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await api.post("/users/submission/final", data);
      toast.success("Project submitted successfully!");
      onClose();
    } catch (error) {
      const errorMessage =
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message || "Failed to submit project.";
      toast.error(errorMessage);
    }
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
            <h1 className="text-4xl font-bold text-white mb-2">
              Mission accomplished? Hit Submit!
            </h1>
            <p className="text-white/80 text-xl">
              You are submitting for:{" "}
              <span className="font-semibold">{reviewStage}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Idea Name
              </label>
              <Input
                type="text"
                placeholder="Enter the name of your idea"
                {...register("title")}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3  placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
              {errors.title && (
                <p className="text-red-400 mt-1 text-sm flex items-center">
                  <Info size={16} className="mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Description
              </label>
              <Input
                type="text"
                placeholder="Enter a brief description of your idea"
                {...register("description")}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3  placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
              {errors.description && (
                <p className="text-red-400 mt-1 text-sm flex items-center">
                  <Info size={16} className="mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                GitHub link
              </label>
              <Input
                type="text"
                placeholder="Enter your GitHub link"
                {...register("github_link")}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
              {errors.github_link && (
                <p className="text-red-400 mt-1 text-sm flex items-center">
                  <Info size={16} className="mr-1" />
                  {errors.github_link.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Figma link
              </label>
              <Input
                type="text"
                placeholder="Enter your Figma link"
                {...register("figma_link")}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
              {errors.figma_link && (
                <p className="text-red-400 mt-1 text-sm flex items-center">
                  <Info size={16} className="mr-1" />
                  {errors.figma_link.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-2xl block text-white font-medium mb-1">
                Presentation Link
              </label>
              <Input
                type="text"
                placeholder="Enter your Figma link"
                {...register("presentation_link")}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-4 py-3 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-300"
              />
              {errors.presentation_link && (
                <p className="text-red-400 mt-1 text-sm flex items-center">
                  <Info size={16} className="mr-1" />
                  {errors.presentation_link.message}
                </p>
              )}
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
                disabled={isSubmitting}
                className="text-3xl border-r-4 border-b-4 border-black bg-white text-gray-800 p-5 rounded-lg font-medium hover:bg-gray-100"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
