import LiveBlocksProvider from "@/components/LiveBlocksProvider";
import { ReactNode } from "react";

export default function PageLayout({ children }: { children: ReactNode }) {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}
