import React from "react";
import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
