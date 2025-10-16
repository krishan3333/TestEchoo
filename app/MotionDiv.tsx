"use client";

import { motion } from "framer-motion";

// This is a simple wrapper around framer-motion's div.
// By putting it in its own file with "use client", we keep the main page as a Server Component.
export const MotionDiv = motion.div;