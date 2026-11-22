"use client";
import { useId, useState } from "react";

/* Password field with a show/hide toggle and a Caps Lock warning. */
export function PasswordInput({
  name = "password",
  label = "Password",
  autoComplete,
  invalid,
  describedBy,
  autoFocus,
}: {
  name?: string;
  label?: string;
  autoComplete: "current-password" | "new-password";
  invalid?: boolean;
  describedBy?: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const [caps, setCaps] = useState(false);
  const checkCaps = (e: React.KeyboardEvent<HTMLInputElement>) => setCaps(e.getModifierState?.("CapsLock") ?? false);
  const hints = [describedBy, caps ? `${id}-caps` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className="au-field">
      <label htmlFor={id}>{label}</label>
      <div className="au-pw">
        <input
          id={id}
          name={name}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          required
          autoFocus={autoFocus}
          aria-invalid={invalid || undefined}
          aria-describedby={hints}
          onKeyUp={checkCaps}
          onKeyDown={checkCaps}
          onBlur={() => setCaps(false)}
          spellCheck={false}
          autoCapitalize="none"
        />
        <button type="button" className="au-show" aria-controls={id} aria-pressed={shown} onClick={() => setShown((s) => !s)}>
          {shown ? "Hide" : "Show"}
        </button>
      </div>
      {caps && (
        <p className="au-hint" id={`${id}-caps`}>
          Caps Lock is on.
        </p>
      )}
    </div>
  );
}
