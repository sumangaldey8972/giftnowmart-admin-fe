import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
            <div className="text-center">
                <h1 className="text-8xl font-extrabold tracking-tight text-white">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-semibold">
                    Page Not Found
                </h2>

                <p className="mt-3 max-w-md text-sm text-gray-400">
                    The page you are looking for does not exist or has been moved.
                </p>

                <div className="mt-8 flex items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
                    >
                        Go Dashboard
                    </Link>

                    <Link
                        href="/"
                        className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-white transition hover:border-gray-500 hover:bg-gray-900"
                    >
                        Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
}