"use client";
import React, { useRef, useState, useEffect } from "react";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SpotlightCard = ({
    children,
    className,
    spotlightColor = "rgba(45, 120, 255, 0.15)",
}: {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={cn(
                "group relative border border-white/10 bg-zinc-900/30 overflow-hidden rounded-xl",
                className
            )}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};
