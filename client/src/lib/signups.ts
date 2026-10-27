export type NewsletterSource = "guide" | "footer" | "meet-mary";

export type SignupPayload =
  | { kind: "newsletter"; source: NewsletterSource; name: string; email: string }
  | {
      kind: "club";
      source: "resource-center";
      name: string;
      email: string;
      mailingAddress: string;
      phone: string;
      timing: string[];
      planningFor: string[];
      partOfTown: string;
      timeOfDay: string[];
      newsletter: boolean;
    };

export async function submitSignup(payload: SignupPayload): Promise<void> {
  const response = await fetch("/api/signups", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Sign-up is temporarily unavailable. Please try again later.");
  }
}
