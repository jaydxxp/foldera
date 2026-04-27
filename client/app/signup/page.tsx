import { AuthForm } from "@/components/auth/auth-form";
import Navbar from "@/components/landing/navbar";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#edf5ff_100%)]  px-30 py-6">
      <Navbar/>
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center gap-8">
        

        <div className="w-full max-w-md">
          <AuthForm mode="signup" />
        </div>
      </div>
    </main>
  );
}
