import { Suspense } from "react";
import { RegisterClient } from "./RegisterClient";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-sm text-white/55">Загрузка…</div>}>
      <RegisterClient />
    </Suspense>
  );
}

