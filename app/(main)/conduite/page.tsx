import { Suspense } from "react";
import ConduitePage from "./ConduitePage"; // Sesuaikan path jika perlu

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConduitePage />
    </Suspense>
  );
}
