export { proxy as default, proxy as middleware } from "./src/proxy";

export const config = {
  matcher: ["/((?!api|_next|brand-assets|.*\\..*).*)"],
};
