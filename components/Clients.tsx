"use client";

import { motion } from "framer-motion";
import { clients } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { childVariants, StaggerGroup } from "./Reveal";

export function Clients() {
  return (
    <section id="clients" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Featured Clients & Projects"
          title="Trusted by brands building something lasting."
          description="A selection of clients and ventures across real estate, sport, product and digital."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <motion.div
              key={client.name}
              variants={childVariants}
              className="group relative flex items-center justify-between overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-all duration-500 hover:border-white/15 hover:bg-surface-2"
            >
              <div>
                <h3 className="font-display text-xl font-semibold transition-colors duration-300 group-hover:text-accent">
                  {client.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{client.field}</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-accent group-hover:text-accent">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </span>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
