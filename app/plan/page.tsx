import { Suspense } from "react";
import { IntakeFlow } from "@/components/intake/IntakeFlow";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IntakeFlow />
    </Suspense>
  );
}
