import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>
      <div className="text-center">
        <p className="font-display text-[22vw] font-bold leading-none tracking-tightest text-white/5 sm:text-[12rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          This page drifted off the grid.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Let&apos;s get you back to the work.
        </p>
        <Link href="/" className="btn-primary mt-8 group">
          Back home
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </main>
  );
}
