export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <p className="text-sm text-muted-foreground">Password reset email flow is ready to connect to Supabase Auth templates.</p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Input name="email" type="email" placeholder="Email" required />
            <Button type="submit">Send reset link</Button>
          </form>
          <Link href="/login" className="mt-4 block text-sm text-primary hover:underline">Back to login</Link>
        </CardContent>
      </Card>
    </main>
  );
}
