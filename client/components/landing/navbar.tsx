import { Folder } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="flex items-center justify-between rounded-[28px] border border-white/70 bg-white/75 px-5 py-4 shadow-sm backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-3xl font-instrument-serif font-extrabold text-blue-600">
  <Folder className="w-8 h-8" />
  <Link href="/">Foldera</Link>
</div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign up
            </a>
            <a
              href="/login"
              className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </a>
          </div>
        </header>
    )
}   