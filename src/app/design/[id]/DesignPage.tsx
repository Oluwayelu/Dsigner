/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { fabric } from "fabric";
import Navbar from "@/layout/design/Navbar";

import Live from "@/components/Live";
import LeftSidebar from "@/layout/design/LeftSidebar";
import RightSidebar from "@/layout/design/RightSidebar";
import { useEffect, useRef } from "react";
import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from "@/lib/canvas";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>("rectangle");

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });

    window.addEventListener("resize", () => {
      handleResize({ fabricRef });
    });
  }, []);
  return (
    <main className="w-full h-screen overflow-hidden">
      <Navbar />

      <div className="flex h-full flex-row bg-secondary-gray">
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </div>
    </main>
  );
}
