"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { login, requestReset } from "@/app/admin/actions";
import { PasswordInput } from "./PasswordInput";

const notices: Record<string, string> = {
  "not-admin": "That account can't edit the site. Sign in with the admin email.",
  "link-expired": "That reset link has expired or was already used. Request a new one.",
};

export function LoginForm({ connected }: { connected: boolean }) {
  const [mode, setMode] = useState<"signin" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [next, setNext] = useState("");
  const [notice, setNotice] = useState("");
  const [signIn, signInAction, signingIn] = useActionState(login, undefined);
  const [reset, resetAction, sending] = useActionState(requestReset, undefined);
  const heading = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Read ?next= and ?e= on the client so the page itself can stay static.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    /* eslint-disable react-hooks/set-state-in-effect */
    setNext(q.get("next") ?? "");
    setNotice(notices[q.get("e") ?? ""] ?? "");
    if (q.get("e") === "link-expired") setMode("reset");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // After a failed attempt, put the cursor where the fix is.
  useEffect(() => {
    if (!signIn?.error) return;
    const target = signIn.field === "email" ? emailRef.current : formRef.current?.querySelector<HTMLInputElement>('input[name="password"]');
    target?.focus();
  }, [signIn]);

  const switchTo = (m: "signin" | "reset") => {
    setMode(m);
    setNotice("");
    requestAnimationFrame(() => heading.current?.focus());
  };

  const state = mode === "signin" ? signIn : reset;
  const busy = mode === "signin" ? signingIn : sending;
  const error = state?.error;

  if (mode === "reset" && reset?.sent) {
    return (
      <>
        <h1 ref={heading} tabIndex={-1}>
          Check your email
        </h1>
        <p className="au-lede" role="status">
          If <b>{reset.email}</b> can sign in here, a reset link is on its way. It works once and expires in an hour.
        </p>
        <button type="button" className="au-text" onClick={() => switchTo("signin")}>
          Back to sign in
        </button>
      </>
    );
  }

  return (
    <>
      <h1 ref={heading} tabIndex={-1}>
        {mode === "signin" ? "Sign in" : "Reset your password"}
      </h1>
      <p className="au-lede">
        {mode === "signin" ? "Edit your blog, projects and site settings." : "Enter your admin email and we'll send you a link to choose a new password."}
      </p>

      {!connected && <p className="au-alert">Sign-in isn&apos;t connected yet. Add the Supabase keys to .env.local, then restart (see README).</p>}
      {notice && !error && <p className="au-alert">{notice}</p>}
      {error && (
        <p className="au-alert" role="alert" id="au-error">
          {error}
        </p>
      )}

      <form ref={formRef} action={mode === "signin" ? signInAction : resetAction} className="au-form" noValidate aria-busy={busy}>
        <input type="hidden" name="next" value={next} />
        <div className="au-field">
          <label htmlFor="au-email">Email</label>
          <input
            ref={emailRef}
            id="au-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={state?.field === "email" || undefined}
            aria-describedby={state?.field === "email" ? "au-error" : undefined}
          />
        </div>

        {mode === "signin" && (
          <PasswordInput autoComplete="current-password" invalid={signIn?.field === "password"} describedBy={signIn?.field === "password" ? "au-error" : undefined} />
        )}

        <button className="au-submit" disabled={busy || !connected}>
          {mode === "signin" ? (busy ? "Signing in…" : "Sign in") : busy ? "Sending link…" : "Send reset link"}
        </button>
      </form>

      <button type="button" className="au-text" onClick={() => switchTo(mode === "signin" ? "reset" : "signin")}>
        {mode === "signin" ? "Forgot your password?" : "Back to sign in"}
      </button>
    </>
  );
}
