import { useState, type FormEvent } from "react";
import { submitSignup } from "@/lib/signups";

const timingOptions = ["Ready to start soon", "In the next 6 to 12 months", "In the next 1 to 2 years", "Just exploring for now"];
const planningOptions = ["Myself", "A parent or loved one", "Both"];
const timeOptions = ["Daytime", "Evening"];

function CheckboxGroup({ legend, name, options }: { legend: string; name: string; options: string[] }) {
  return (
    <fieldset className="club-form__checks">
      <legend>{legend} <span>(optional)</span></legend>
      {options.map((option) => (
        <label key={option}><input type="checkbox" name={name} value={option} />{option}</label>
      ))}
    </fieldset>
  );
}

export default function ClubSignup() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
        kind: "club",
        source: "resource-center",
        name,
        email: String(data.get("email") || "").trim(),
        mailingAddress: String(data.get("mailingAddress") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        timing: data.getAll("timing").map(String),
        planningFor: data.getAll("planningFor").map(String),
        partOfTown: String(data.get("partOfTown") || "").trim(),
        timeOfDay: data.getAll("timeOfDay").map(String),
        newsletter: data.get("newsletter") === "yes",
      });
      setSubmitted(true);
      setMessage("You're on the list! We'll be in touch as soon as dates are set.");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign-up is temporarily unavailable. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="club-form-panel">
      {submitted ? <p className="club-form__success" role="status">{message}</p> : (
        <form className="club-form" onSubmit={handleSubmit} aria-busy={busy}>
          <div className="club-form__row">
            <label>Name <span>(required)</span><input name="name" type="text" autoComplete="name" required maxLength={100} onInput={(event) => event.currentTarget.setCustomValidity("")} /></label>
            <label>Email address <span>(required)</span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          </div>
          <div className="club-form__row">
            <label>Mailing address <span>(optional)</span><input name="mailingAddress" type="text" autoComplete="street-address" maxLength={300} /></label>
            <label>Phone number <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
          </div>
          <CheckboxGroup legend="Where are you in your thinking?" name="timing" options={timingOptions} />
          <CheckboxGroup legend="Who are you planning for?" name="planningFor" options={planningOptions} />
          <label>Which part of town works best for you? <span>(optional)</span><input name="partOfTown" type="text" maxLength={120} /></label>
          <CheckboxGroup legend="What time of day works best?" name="timeOfDay" options={timeOptions} />
          <label className="club-form__newsletter"><input type="checkbox" name="newsletter" value="yes" />Yes, also send me The Anchored Home newsletter.</label>
          <button type="submit" disabled={busy}>Keep me posted</button>
          {message && <p className="club-form__error" role="alert">{message}</p>}
        </form>
      )}
    </div>
  );
}
