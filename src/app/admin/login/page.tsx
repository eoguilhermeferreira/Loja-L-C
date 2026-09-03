"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { signIn } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeConfig } from "@/config/store";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <Card className="w-full max-w-sm space-y-6 p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="" width={72} height={72} className="size-18 rounded-full" />
          <h1 className="font-display text-xl font-semibold">
            <span className="text-accent">{storeConfig.name}</span> · Admin
          </h1>
          <p className="text-sm text-muted-foreground">Entre com sua conta de administrador.</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-1.5 block">E-mail</Label>
            <Input id="email" name="email" type="email" required autoComplete="username" />
          </div>
          <div>
            <Label htmlFor="password" className="mb-1.5 block">Senha</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>

          {state?.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
}
