import { Suspense } from "react";
import LoadingFallback from "./LoadingFallback";


export default function SuspenseWrapper ({ children }) {
    return (
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    )
};