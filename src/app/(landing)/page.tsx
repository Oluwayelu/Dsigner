"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
// import Navbar from "@/layout/landing/Navbar";

export default function LandingPage() {
  return (
    <div className="w-full  max-w-screen-xl mx-auto">
      <div className="w-1/3 space-y-3">
        <h1 className="text-7xl font-semibold">
          Bring Your Ideas to Life with <Logo className="text-7xl" />
        </h1>

        <p>
          Collaborate, create, and innovate with the ultimate design tool for
          modern creators. From wireframes to pixel-perfect designs, Dsigner
          empowers you to turn your vision into reality—all in one seamless
          platform.
        </p>
        <Button className="bg-primary-green font-semibold rounded-full">
          Start designing now
        </Button>
      </div>
    </div>
  );
}
