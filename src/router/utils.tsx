import { Suspense, type ReactNode } from "react";
import { PageLoader } from "@/components/shared/PageLoader";

export function withSuspense(element: ReactNode) {
    return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}
