<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the FashionHero Next.js 16 App Router project. PostHog is initialized via `instrumentation-client.ts` using a `/ingest` reverse proxy (EU region), with `capture_exceptions: true` for automatic error tracking. Environment variables are stored in `.env.local`. A reverse proxy is configured in `next.config.ts` routing `/ingest/*` through `eu.i.posthog.com` and `/ingest/static/*` + `/ingest/array/*` through `eu-assets.i.posthog.com`.

Users are identified on login and registration using `posthog.identify()` with their email as the distinct ID.

| Event | Description | File |
|-------|-------------|------|
| `add_to_cart` | User adds a product from the product detail page | `src/components/product-info.tsx` |
| `add_to_cart` | User adds a product via the quick-view modal | `src/components/quick-view-modal.tsx` |
| `cart_item_removed` | User removes an item from the cart | `src/components/cart-provider.tsx` |
| `checkout_started` | User arrives at checkout with items in the cart | `src/app/checkout/page.tsx` |
| `order_placed` | User clicks the Place Order button | `src/app/checkout/page.tsx` |
| `user_signed_in` | User successfully signs in (+ `posthog.identify`) | `src/app/account/login/page.tsx` |
| `user_registered` | User successfully registers (+ `posthog.identify`) | `src/app/account/register/page.tsx` |
| `product_wishlisted` | User adds a product to their wishlist | `src/components/wishlist-button.tsx` |
| `product_unwishlisted` | User removes a product from their wishlist | `src/components/wishlist-button.tsx` |
| `product_searched` | User clicks a product result in the search modal | `src/components/search-modal.tsx` |
| `promoted_banner_clicked` | Seller clicks the promoted listing banner | `src/app/seller/page.tsx` |
| `promoted_waitlist_signup` | Seller signs up for the promoted listings waitlist | `src/app/podbij-listing/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/701627)
- [Purchase conversion funnel](/insights/ALn5Tpew) — add_to_cart → checkout_started → order_placed
- [Add to cart over time](/insights/dS6of4zj) — daily cart adds trend
- [New user signups & logins](/insights/5ZXXIoeJ) — registrations and sign-ins over time
- [Cart abandonment (removals vs adds)](/insights/PnGXF5cT) — adds vs removals side-by-side
- [Seller promoted listing funnel](/insights/a8tOdJLV) — banner clicked → waitlist signup

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
