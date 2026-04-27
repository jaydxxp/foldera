import Navbar from "@/components/landing/navbar";

export default function Home() {
  return (  
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_28%),linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <Navbar/>
        
        <section className="flex flex-1 flex-col items-center justify-center gap-8 sm:gap-10 lg:gap-16 py-8 sm:py-12 lg:py-16 text-center">
          <div className="max-w-4xl space-y-6 sm:space-y-8 px-2 sm:px-0">
            
            <div className="space-y-4 sm:space-y-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-950 font-instrument-serif leading-tight sm:leading-tight lg:leading-tight px-2 sm:px-0">
                A calmer way to organize image folders like your own personal drive.
              </h1>
              <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed sm:leading-6 text-slate-600 px-4 sm:px-0">
                Create nested folders, upload images into the exact branch they belong in, and explore the full hierarchy from one clean workspace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-blue-700 active:scale-95"
              >
                Login to your workspace
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
              >
                Create account
              </a>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8 text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
              <div className="rounded-2xl sm:rounded-3xl border border-white/70 bg-white/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                <p className="text-sm font-semibold text-slate-900">Nested folder tree</p>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed sm:leading-6 text-slate-500">
                  Browse full hierarchy in the sidebar and jump into any branch.
                </p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl border border-white/70 bg-white/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                <p className="text-sm font-semibold text-slate-900">Cloud image storage</p>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed sm:leading-6 text-slate-500">
                  Upload images to Cloudinary while keeping only metadata in MongoDB.
                </p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl border border-white/70 bg-white/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                <p className="text-sm font-semibold text-slate-900">Private by default</p>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed sm:leading-6 text-slate-500">
                  JWT auth and per-user scoping keep each workspace isolated.
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-5xl px-2 sm:px-4 lg:px-0">
            <div className="absolute -inset-4 sm:-inset-6 rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-sky-200/50 to-transparent blur-3xl" />
            <div className="relative rounded-2xl sm:rounded-[28px] lg:rounded-[32px] border border-white/70 bg-white/82 p-3 sm:p-4 lg:p-5 shadow-2xl backdrop-blur">
              <div className="rounded-2xl sm:rounded-[24px] lg:rounded-[28px] border border-slate-200 bg-slate-50 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 text-left">Workspace preview</p>
                    <p className="text-xs text-slate-500 text-left">Folder hierarchy with fast image navigation</p>
                  </div>
                  <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 w-fit">
                    Live structure
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 text-left grid-cols-1 lg:grid-cols-[0.9fr,1.1fr]">
                  <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Sidebar tree</p>
                    <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="rounded-lg sm:rounded-xl bg-sky-50 px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-sky-700 text-sm sm:text-base">My Drive</div>
                      <div className="ml-2 sm:ml-4 rounded-lg sm:rounded-xl bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-slate-700 shadow-sm text-sm sm:text-base">Projects</div>
                      <div className="ml-4 sm:ml-6 lg:ml-8 rounded-lg sm:rounded-xl bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-slate-700 shadow-sm text-sm sm:text-base">Brand Assets</div>
                      <div className="ml-6 sm:ml-8 lg:ml-12 rounded-lg sm:rounded-xl bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-slate-700 shadow-sm text-sm sm:text-base">Launch Images</div>
                      <div className="ml-2 sm:ml-4 rounded-lg sm:rounded-xl bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-slate-700 shadow-sm text-sm sm:text-base">Travel</div>
                    </div>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Main workspace</p>
                    <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                      <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                        <p className="text-sm sm:text-base font-medium text-slate-900">Full hierarchy explorer</p>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500">
                          View parent folders, nested branches, and folder sizes in one place.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                          <p className="text-xs sm:text-sm font-medium text-slate-900">Subfolders</p>
                          <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-500">Open any folder directly from cards.</p>
                        </div>
                        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                          <p className="text-xs sm:text-sm font-medium text-slate-900">Image uploads</p>
                          <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-500">Drop images into the selected folder.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
