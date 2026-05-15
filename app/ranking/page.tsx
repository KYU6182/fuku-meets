import { Suspense } from "react";
import RankingPage from "@/components/RankingPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RankingPage />
    </Suspense>
  );
}
