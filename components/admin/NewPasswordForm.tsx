"use client";
import { useActionState } from "react";
import { updatePassword } from "@/app/admin/actions";
import { PasswordInput } from "./PasswordInput";

export function NewPasswordForm() {
  const [state, action, busy] = useActionState(updatePassword, undefined);
  return (
    <>
      <h1>Choose a new password</h1>
      <p className="au-lede">At least 10 characters. A short phrase is easier to remember than random symbols.</p>
      {state?.error && (
        <p className="au-alert" role="alert" id="au-error">
          {state.error}
        </p>
      )}
      <form action={action} className="au-form" noValidate aria-busy={busy}>
        <PasswordInput label="New password" autoComplete="new-password" autoFocus invalid={Boolean(state?.error)} describedBy={state?.error ? "au-error" : undefined} />
        <PasswordInput name="confirm" label="Type it again" autoComplete="new-password" invalid={Boolean(state?.error)} />
        <button className="au-submit" disabled={busy}>
          {busy ? "Saving…" : "Save password"}
        </button>
      </form>
    </>
  );
}
