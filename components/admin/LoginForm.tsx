"use client";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="ad-card ad-stack">
      <label className="ad-field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required autoFocus />
      </label>
      <label className="ad-field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state?.error && (
        <p className="ad-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
