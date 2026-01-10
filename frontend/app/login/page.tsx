import { Suspense } from "react";
import { LoginClient } from "./LoginClient";

export default function LoginPage() {
  // NOTE: `useSearchParams` requires suspense boundary.
  return (
    <Suspense fallback={<div className="text-sm text-gray-600">Загрузка…</div>}>
      <LoginClient />
    </Suspense>
  );
}

