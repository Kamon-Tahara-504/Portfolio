import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white py-16">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">404</h1>
        <p className="mb-8 text-lg text-black/70">
          Project not found
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center border-2 border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/90"
        >
          Back to Projects
        </Link>
      </div>
    </div>
  );
}

