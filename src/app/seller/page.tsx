"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { salesData, bestSellers, runFabInfo } from "@/data/seller-dashboard";
import { SalesChart } from "./sales-chart";
import posthog from "posthog-js";
import { trackEvent } from "@/lib/analytics";

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user || user.role !== "seller") {
      router.replace("/account/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    posthog.capture("promoted_banner_impression");
  }, []);

  if (!user || user.role !== "seller") {
    return null;
  }

  const totalRevenue = salesData
    .filter((d) => d.value !== null)
    .reduce((sum, d) => sum + (d.value ?? 0), 0);

  const totalDays = salesData.filter((d) => d.value !== null).length;

  function handleLogout() {
    logout();
    router.push("/");
  }

  function handleBannerClick() {
    trackEvent("promoted_banner_click", {
      merchant_id: user!.sellerId ?? user!.email,
      timestamp: new Date().toISOString(),
    });
    if (process.env.NODE_ENV === "production") {
      posthog.capture("promoted_banner_clicked", {
        merchant_id: user!.sellerId ?? user!.email,
      });
    }
    router.push("/podbij-listing");
  }

  return (
    <main className="min-h-screen bg-cream-light">
      {/* Header */}
      <header className="border-b border-black/10 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-warm-gray uppercase tracking-widest mb-0.5">Panel Sprzedawcy</p>
          <h1 className="text-xl font-light text-charcoal">{runFabInfo.name}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] uppercase tracking-widest text-warm-gray hover:text-charcoal transition-colors border border-black/15 px-4 py-2 rounded"
        >
          Wyloguj
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Promoted Listings Banner */}
        <section
          className="rounded-lg p-5 flex items-center justify-between gap-4 border border-black/10 shadow-sm"
          style={{ backgroundColor: "#F5F0EB" }}
        >
            <div className="flex items-center gap-4 min-w-0">
              {/* Icon */}
              <div
                className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#E8845A" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 14V4M9 4L4.5 8.5M9 4L13.5 8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[1px] mb-0.5" style={{ color: "#E8845A" }}>
                  Nowość dla sprzedawców
                </p>
                <p className="text-[14px] text-charcoal leading-snug">
                  Podbij swój listing w wyszukiwarce FashionHero — <span className="font-semibold">19 PLN / tydzień.</span>
                </p>
                <p className="text-[12px] text-warm-gray mt-0.5">Większa widoczność, więcej zamówień.</p>
              </div>
            </div>

            <button
              onClick={handleBannerClick}
              className="shrink-0 bg-charcoal text-cream-light text-[11px] font-semibold uppercase tracking-widest px-5 py-2.5 rounded hover:opacity-80 transition-opacity"
            >
              Włącz →
            </button>
        </section>

        {/* Sales Section */}
        <section className="bg-white border border-black/10 rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-[13px] font-medium uppercase tracking-widest text-charcoal mb-1">
                Sprzedaż — maj 2026
              </h2>
              <p className="text-[12px] text-warm-gray">
                {totalDays} dni · łącznie{" "}
                <span className="text-charcoal font-medium">
                  {totalRevenue.toLocaleString("pl-PL")} zł
                </span>
              </p>
            </div>
          </div>

          <SalesChart data={salesData} />

          <div className="mt-6 pt-4 border-t border-black/5">
            <button
              disabled
              className="text-[11px] uppercase tracking-widest text-warm-gray border border-black/10 px-4 py-2 rounded cursor-not-allowed opacity-50"
            >
              Pełne statystyki (wkrótce)
            </button>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="bg-white border border-black/10 rounded-lg p-6">
          <h2 className="text-[13px] font-medium uppercase tracking-widest text-charcoal mb-6">
            Bestsellery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {bestSellers.map((product, idx) => (
              <div
                key={idx}
                className="border border-black/10 rounded-lg overflow-hidden"
              >
                <div className="relative aspect-square bg-cream-light">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[13px] text-charcoal font-medium leading-tight mb-2">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-warm-gray">
                    {product.unitsSold} szt. sprzedanych
                  </p>
                  <p className="text-[12px] text-charcoal font-medium mt-0.5">
                    {product.revenue.toLocaleString("pl-PL")} zł
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-black/5">
            <button
              disabled
              className="text-[11px] uppercase tracking-widest text-warm-gray border border-black/10 px-4 py-2 rounded cursor-not-allowed opacity-50"
            >
              Pełne statystyki (wkrótce)
            </button>
          </div>
        </section>

        {/* Company Info */}
        <section className="bg-white border border-black/10 rounded-lg p-6">
          <h2 className="text-[13px] font-medium uppercase tracking-widest text-charcoal mb-6">
            Dane firmy
          </h2>

          <dl className="space-y-3">
            {[
              { label: "Nazwa firmy", value: runFabInfo.name },
              { label: "Adres", value: runFabInfo.address },
              { label: "NIP", value: runFabInfo.nip },
              { label: "Telefon", value: runFabInfo.phone },
              { label: "Email", value: runFabInfo.email },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <dt className="text-[11px] uppercase tracking-widest text-warm-gray sm:w-32 shrink-0">
                  {label}
                </dt>
                <dd className="text-[13px] text-charcoal">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 pt-4 border-t border-black/5">
            <button
              disabled
              className="text-[11px] uppercase tracking-widest text-warm-gray border border-black/10 px-4 py-2 rounded cursor-not-allowed opacity-50"
            >
              Edycja danych (wkrótce)
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
