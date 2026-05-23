export const runFabInfo = {
  name: "RunFab",
  address: "ul. Marszałkowska 10, 00-590 Warszawa",
  nip: "525-000-13-42",
  phone: "+48 22 100 13 00",
  email: "kontakt@runfab.pl",
};

// May 2026: days 1–17 have sales data, days 18–31 are null (future)
const rawValues = [
  2340, 1870, 3210, 980, 4120, 2750, 1560,
  3890, 2100, 4450, 3070, 1240, 2980, 3640,
  1790, 4200, 2530,
];

export const salesData: { day: number; value: number | null }[] = Array.from(
  { length: 31 },
  (_, i) => ({
    day: i + 1,
    value: i < 17 ? rawValues[i] : null,
  })
);

export const bestSellers = [
  {
    name: "RunFab AirStrike Pro",
    imageUrl: "/images/products/product-3.jpg",
    unitsSold: 142,
    revenue: 28258,
  },
  {
    name: "RunFab Trail X",
    imageUrl: "/images/products/product-7.jpg",
    unitsSold: 98,
    revenue: 18130,
  },
  {
    name: "RunFab Speed Lite",
    imageUrl: "/images/products/product-12.jpg",
    unitsSold: 76,
    revenue: 12236,
  },
];
