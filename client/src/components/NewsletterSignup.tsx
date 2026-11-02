import { useState, type FormEvent } from "react";
import { submitSignup, type NewsletterSource } from "@/lib/signups";

type Props = {
  source: NewsletterSource;
  onSuccess?: () => void;
};

export default function NewsletterSignup({ source, onSuccess }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [signedUp, setSignedUp] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    nameInput.setCustomValidity(name ? "" : "Please enter your name.");
    if (!form.reportValidity()) return;
    setBusy(true);
    setMessage("");
    try {
      await submitSignup({
        kind: "newsletter",
        source,
        name,
        email: String(data.get("email") || "").trim(),
      });
      setSignedUp(true);
      setMessage("You’re signed up for The Anchored Home.");
      form.reset();
      onSuccess?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign-up is temporarily unavailable. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit} aria-busy={busy}>
      {!signedUp && (
        <div className="signup-form__fields">
          <label>Name<input name="name" type="text" autoComplete="name" required maxLength={100} onInput={(event) => event.currentTarget.setCustomValidity("")} /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          <button type="submit" disabled={busy}>Sign me up</button>
        </div>
      )}
      {message && <p className="signup-form__status" role={signedUp ? "status" : "alert"}>{message}</p>}
    </form>
  );
}
