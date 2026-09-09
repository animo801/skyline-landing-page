import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white px-6 py-8 sm:px-8 md:px-16 lg:px-20">
      <div className="flex flex-col items-center gap-3 text-center text-sm text-black/60 sm:flex-row sm:justify-between sm:text-left">
        <p>
          &copy; {new Date().getFullYear()} Skyline Smart Lighting. All
          rights reserved.
        </p>
        <Link href="/privacy" className="underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
