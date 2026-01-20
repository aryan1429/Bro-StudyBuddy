"use client";
import React, { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
    words,
    className,
}: {
    words: string;
    className?: string;
}) => {
    const [scope, animate] = useAnimate();
    const wordsArray = words.split(" ");

    useEffect(() => {
        animate(
            "span",
            {
                opacity: 1,
                filter: "blur(0px)",
            },
            {
                duration: 0.5,
                delay: stagger(0.2),
            }
        );
    }, [scope.current]);

    return (
        <div className={cn("font-bold", className)}>
            <div className="mt-4">
                <div className="dark:text-white text-black leading-snug tracking-wide">
                    <motion.div ref={scope}>
                        {wordsArray.map((word, idx) => {
                            return (
                                <motion.span
                                    key={word + idx}
                                    className="dark:text-white text-black opacity-0 blur-sm"
                                    style={{
                                        filter: "blur(10px)",
                                    }}
                                >
                                    {word}{" "}
                                </motion.span>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
