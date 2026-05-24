"use client";

import { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { useAuth } from "@/components/auth-provider";
import { trackEvent } from "@/lib/analytics";

function saveToWaitlist(merchantId: string, email: string) {
  try {
    const stored = JSON.parse(localStorage.getItem("stepforward-waitlist") ?? "[]");
    stored.push({ merchant_id: merchantId, email, timestamp: new Date().toISOString() });
    localStorage.setItem("stepforward-waitlist", JSON.stringify(stored));
  } catch {}
}

export default function PodbijListingPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Podaj poprawny adres email.");
      return;
    }

    setStatus("loading");

    const merchantId = user?.sellerId ?? user?.email ?? "anonymous";
    saveToWaitlist(merchantId, email);
    trackEvent("promoted_waitlist_signup", {
      merchant_id: merchantId,
      email,
      timestamp: new Date().toISOString(),
    });
    posthog.capture("promoted_waitlist_signup", {
      merchant_id: merchantId,
    });

    setTimeout(() => {
      setStatus("success");
    }, 600);
  }

  return (
    <div className="min-h-screen bg-cream-light">
      <div className="max-w-lg mx-auto px-4 py-12">

        {/* Back link */}
        <Link
          href="/seller"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.8px] text-warm-gray hover:text-charcoal transition-colors mb-10"
        >
          ← Wróć do pulpitu
        </Link>

        {/* Label */}
        <p className="text-[11px] font-semibold uppercase tracking-[1px] mb-3" style={{ color: "#E8845A" }}>
          Wkrótce
        </p>

        {/* Heading */}
        <h1 className="text-3xl font-light text-charcoal mb-4 leading-tight">
          Podbij swój listing<br />w wyszukiwarce
        </h1>

        {/* Description */}
        <p className="text-[14px] text-warm-gray leading-relaxed mb-8">
          Promowane produkty pojawiają się wyżej w wynikach wyszukiwania FashionHero — w miejscu,
          gdzie kupujący patrzą najczęściej. Włącz promocję dla wybranych listingów i mierz wpływ
          na liczbę zamówień.
        </p>

        {/* Price / Start boxes */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white border border-black/10 rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-[0.8px] text-warm-gray mb-2">Cena</p>
            <p className="text-2xl font-semibold text-charcoal leading-none mb-1">19 PLN<span className="text-base font-normal"> / tydzień</span></p>
            <p className="text-[11px] text-warm-gray">za jeden promowany listing</p>
          </div>
          <div className="bg-white border border-black/10 rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-[0.8px] text-warm-gray mb-2">Start</p>
            <p className="text-2xl font-semibold text-charcoal leading-none mb-1">Czerwiec<span className="text-base font-normal"> 2026</span></p>
            <p className="text-[11px] text-warm-gray">powiadomimy cię mailem</p>
          </div>
        </div>

        {/* Form / Success */}
        {status === "success" ? (
          <div className="bg-white border border-black/10 rounded-lg p-6 text-center">
            <p className="text-[14px] text-charcoal font-medium mb-1">Zapisano!</p>
            <p className="text-[13px] text-warm-gray">Dzięki — odezwiemy się przy starcie w czerwcu 2026.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5"
              >
                Email do powiadomienia
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors bg-white"
                placeholder="ty@firma.pl"
              />
              {errorMsg && <p className="text-red-600 text-[13px] mt-1">{errorMsg}</p>}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-cta w-full text-[12px] disabled:opacity-60"
            >
              {status === "loading" ? "Zapisuję..." : "Zapisz mnie na listę"}
            </button>

            <p className="text-[11px] text-warm-gray text-center leading-relaxed">
              Zapis na listę jest darmowy i niezobowiązujący — nic nie pobierzemy z Twojej karty.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
