import { AuthForm } from "@/components/auth/auth-form";
import Navbar from "@/components/landing/navbar";

export default function LoginPage() {
  return (
    <main className="min-h-screen px-30 py-6">
      <Navbar/>
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center gap-8">
       

        <div className="w-full max-w-md">
          <AuthForm mode="login" />
        </div>
      </div>
    </main>
  );
}
