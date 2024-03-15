import Image from "next/image";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { useState, useEffect } from "react";
import { getProduct } from "@/apiqueries/apiqueries";

export default function Home({ params }: { params: { slug: string } }) {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center">
      <div className="flex h-full w-full flex-col md:flex-row">
        <div className="flex h-full w-full items-center justify-center">
          <div></div>
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <div>
            <div>Sneaker Comany</div>
            <div>Fall Limited Edition Sneakers</div>
          </div>
          <div>s</div>
          <div></div>
          <div></div>
        </div>
      </div>
    </main>
  );
}
