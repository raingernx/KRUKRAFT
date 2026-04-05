"use client";

import { useEffect } from "react";

import { loadGeneratedBonesRegistry } from "@/bones";

export function BonesRegistryBootstrap() {
  useEffect(() => {
    void loadGeneratedBonesRegistry();
  }, []);

  return null;
}
