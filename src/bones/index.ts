export async function loadGeneratedBonesRegistry() {
  if (typeof window === "undefined") {
    return;
  }

  await import("./registry.js").catch(() => undefined);
}
