import { Suspense, type ReactNode } from "react";

export function PageLoader() {
    return <div className="min-h-screen bg-background-light" aria-hidden="true" />;
}

export function withSuspense(element: ReactNode) {
    return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}
