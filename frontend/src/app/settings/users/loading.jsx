
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner"

export default function Loading() {
    return (
        <div className="loading-screen w-full h-full flex justify-center items-center">
            <LoadingSpinner />
        </div>
    )
}