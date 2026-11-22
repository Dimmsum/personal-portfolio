"use client";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [msg, setMsg] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setMsg("Copied");
    } catch {
      setMsg("Select and copy");
    }
    setTimeout(() => setMsg(""), 1800);
  };
  return (
    <>
      <button className="textlink" onClick={copy}>
        Copy
      </button>
      <span className="copied" aria-live="polite">
        {msg}
      </span>
    </>
  );
}
