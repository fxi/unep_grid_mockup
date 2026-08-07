export type IndicatorSet = "Climate" | "Biodiversity" | "Pollution";

export interface Indicator {
  label: string;
  value: string;
  unit: string;
  delta: string;
  direction: "up" | "down";
  bad: boolean;
  range: string;
  source: string;
  series: number[];
}

export const INDICATOR_SETS: Record<IndicatorSet, Indicator[]> = {
  Climate: [
    { label: "Global surface temperature anomaly", value: "+1.55", unit: "°C", delta: "+0.14 / decade", direction: "up", bad: true, range: "1880–2025", source: "GISTEMP", series: [0, 0.05, 0.12, 0.2, 0.28, 0.42, 0.5, 0.62, 0.78, 0.9, 1.02, 1.18, 1.34, 1.55] },
    { label: "Atmospheric CO₂", value: "424", unit: "ppm", delta: "+2.3 / year", direction: "up", bad: true, range: "1958–2025", source: "NOAA", series: [316, 322, 330, 338, 345, 352, 358, 366, 375, 385, 395, 405, 415, 424] },
    { label: "Global mean sea level", value: "+105", unit: "mm", delta: "+4.2 / year", direction: "up", bad: true, range: "since 1993", source: "Altimetry", series: [0, 8, 16, 24, 33, 41, 50, 58, 66, 75, 83, 91, 98, 105] },
    { label: "Arctic sea ice, September minimum", value: "−12.2", unit: "% / decade", delta: "−1.1 / decade", direction: "down", bad: true, range: "1979–2025", source: "NSIDC", series: [7.6, 7.4, 7.2, 7, 6.9, 6.5, 6.2, 5.9, 5.4, 5.1, 4.9, 4.7, 4.5, 4.3] },
    { label: "Ocean heat content, 0–2000 m", value: "289", unit: "ZJ", delta: "+12 / year", direction: "up", bad: true, range: "since 1955", source: "NCEI", series: [0, 12, 26, 41, 60, 82, 104, 131, 158, 188, 214, 240, 266, 289] },
    { label: "Glacier cumulative mass balance", value: "−27.5", unit: "m w.e.", delta: "−1.2 / year", direction: "down", bad: true, range: "since 1970", source: "WGMS", series: [0, -2, -4, -6, -8.5, -11, -13.5, -16, -18, -20, -22, -24, -26, -27.5] },
  ],
  Biodiversity: [
    { label: "Living Planet Index", value: "−73", unit: "%", delta: "−2.4 / year", direction: "down", bad: true, range: "1970–2024", source: "WWF / ZSL", series: [100, 92, 84, 76, 68, 60, 53, 47, 42, 37, 33, 30, 28, 27] },
    { label: "Terrestrial protected areas", value: "17.6", unit: "% of land", delta: "+0.3 / year", direction: "up", bad: false, range: "2000–2025", source: "WDPA", series: [11.2, 11.9, 12.6, 13.2, 13.9, 14.4, 15, 15.5, 16, 16.4, 16.8, 17.1, 17.4, 17.6] },
    { label: "Marine protected areas", value: "8.4", unit: "% of ocean", delta: "+0.4 / year", direction: "up", bad: false, range: "2000–2025", source: "WDPA", series: [1.1, 1.5, 2, 2.6, 3.2, 4, 4.8, 5.5, 6.2, 6.8, 7.3, 7.8, 8.1, 8.4] },
    { label: "Annual forest cover loss", value: "6.4", unit: "Mha / year", delta: "−0.2 / year", direction: "down", bad: false, range: "2001–2025", source: "GFW", series: [8.1, 8.6, 9, 8.4, 8.9, 8.2, 7.9, 7.6, 7.8, 7.2, 7, 6.8, 6.6, 6.4] },
    { label: "Species assessed as threatened", value: "46.3", unit: "thousand", delta: "+1.9 / year", direction: "up", bad: true, range: "2010–2025", source: "IUCN Red List", series: [18, 20, 22, 25, 27, 29, 31, 33, 36, 38, 40, 42, 44, 46.3] },
    { label: "Remaining wetland extent", value: "−35", unit: "%", delta: "−0.6 / year", direction: "down", bad: true, range: "since 1970", source: "Ramsar", series: [100, 97, 94, 91, 88, 85, 82, 79, 76, 73, 71, 68, 66, 65] },
  ],
  Pollution: [
    { label: "Population-weighted PM2.5 exposure", value: "32", unit: "µg/m³", delta: "−0.5 / year", direction: "down", bad: false, range: "2000–2025", source: "WHO", series: [41, 40.5, 40, 39, 38.5, 37.5, 37, 36, 35, 34.5, 34, 33.2, 32.6, 32] },
    { label: "Plastic entering the ocean", value: "11", unit: "Mt / year", delta: "+0.4 / year", direction: "up", bad: true, range: "2000–2025", source: "UNEP", series: [4, 4.6, 5.2, 5.8, 6.4, 7, 7.6, 8.2, 8.8, 9.3, 9.8, 10.3, 10.7, 11] },
    { label: "Electronic waste generated", value: "62", unit: "Mt / year", delta: "+2.6 / year", direction: "up", bad: true, range: "2010–2025", source: "GESP", series: [34, 36, 38, 41, 43, 45, 47, 49, 52, 54, 56, 58, 60, 62] },
    { label: "Wastewater safely treated", value: "58", unit: "%", delta: "+1.1 / year", direction: "up", bad: false, range: "2015–2025", source: "SDG 6.3.1", series: [44, 45, 46.5, 48, 49, 50.5, 51.5, 53, 54, 55, 56, 56.8, 57.4, 58] },
    { label: "Nitrogen surplus on cropland", value: "76", unit: "kg N / ha", delta: "+0.9 / year", direction: "up", bad: true, range: "2000–2025", source: "FAO", series: [58, 60, 62, 63, 65, 66, 68, 69, 70, 71, 72, 74, 75, 76] },
    { label: "Chemicals in international trade", value: "2.4", unit: "trn US$", delta: "+3.8 % / year", direction: "up", bad: true, range: "2005–2025", source: "UNCTAD", series: [1, 1.1, 1.25, 1.35, 1.2, 1.45, 1.6, 1.7, 1.8, 1.9, 2, 2.15, 2.3, 2.4] },
  ],
};

export const INDICATOR_SET_NAMES = Object.keys(INDICATOR_SETS) as IndicatorSet[];

export const PLATFORMS = [
  { name: "MapX", description: "Open geospatial platform for managing and visualising data on natural resources." },
  { name: "Environmental Situation Room", description: "Near-real-time monitoring of environmental emergencies and their human footprint." },
  { name: "Data catalogue", description: "Curated datasets and SDG-aligned series, documented and ready to download or query." },
  { name: "Capacity building", description: "Training national teams to produce, publish and defend their own environmental statistics." },
];
