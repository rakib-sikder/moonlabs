"use client";

import { motion } from "framer-motion";
import { Fragment, type ElementType } from "react";

/** Heading whose words rise out of a blur, one after another, when scrolled into view. */
export function RevealText({
  text,
  as = "h2",
  className = "",
  delay = 0,
  highlight = [],
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Words (exact match, punctuation included) rendered with the moonlight gradient. */
  highlight?: string[];
}) {
  const Tag = as;
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: delay } } }}
      >
        {/* Real spaces between words (not margins), so search engines read separate words. */}
        {words.map((w, i) => (
          <Fragment key={i}>
          {i > 0 && " "}
          <span className="inline-block overflow-hidden pb-[0.1em] align-top">
            <motion.span
              className={`inline-block ${highlight.includes(w) ? "text-moonlight" : ""}`}
              variants={{
                hidden: { y: "100%", opacity: 0, filter: "blur(8px)" },
                show: {
                  y: "0%",
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {w}
            </motion.span>
          </span>
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
