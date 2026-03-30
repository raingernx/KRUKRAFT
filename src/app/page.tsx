import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default function HomeRedirectPage() {
  // Redirect the root route to the Discover marketplace
  redirect(routes.marketplace);
}
