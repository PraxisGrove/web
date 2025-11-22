"use client";
import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Sparkles } from "lucide-react";

export default function HoverBorderGradientDemo() {
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-8 py-3"
      >
        <Sparkles className="h-5 w-5" />
        <span className="text-lg font-bold">Start Learning</span>
      </HoverBorderGradient>
    </div>
  );
}