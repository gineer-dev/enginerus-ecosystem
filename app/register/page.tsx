export const dynamic = "force-dynamic";

import Link from "next/link";
import { signUp } from "@/services/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function authMessage(error?: string) {
  if (!error) return null;
  if (error.includes("For security purposes")) {
    return "Supabase is cooling down signup requests for this email. Wait about one minute, then submit the form once.";
  }
  return error;
}

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const message = authMessage(error);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your EngineRus account</CardTitle>
          <p className="text-sm text-muted-foreground">Create a staff account to access service, dyno, inventory, CRM, and audit operations.</p>
        </CardHeader>
        <CardContent>
          {message ? (
            <div className="mb-4 rounded-lg border border-[#d17e1d]/40 bg-[#fff8e1] px-3 py-2 text-sm font-semibold text-primary">
              {message}
            </div>
          ) : null}
          <form action={signUp} className="grid gap-4">
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password" required />
            <Button type="submit">Register</Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Already registered? <Link href="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
