import { useEffect, useRef } from "react";
import maplibregl, {
  type LngLatLike,
  type Map as MapLibreMap,
  type StyleSpecification,
} from "maplibre-gl";

interface CameraBeat {
  center: LngLatLike;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface LightingBeat {
  x: string;
  y: string;
  color: string;
  glow: number;
  shade: number;
  brightness: number;
  contrast: number;
  saturation: number;
  lightPosition: [number, number, number];
}

const CAMERA_BEATS: Record<number, CameraBeat> = {
  0: { center: [18, 12], zoom: 1.25, pitch: 0, bearing: -8 },
  1: { center: [8, 15], zoom: 3.15, pitch: 25, bearing: -10 },
  2: { center: [9.5, 46.4], zoom: 3.85, pitch: 38, bearing: 14 },
  3: { center: [122, -2], zoom: 3.05, pitch: 28, bearing: -18 },
};

const LIGHTING_BEATS: Record<number, LightingBeat> = {
  0: { x: "72%", y: "66%", color: "#ffdba8", glow: 0.38, shade: 0.64, brightness: 0.72, contrast: 0.22, saturation: -0.08, lightPosition: [1.5, 110, 78] },
  1: { x: "69%", y: "46%", color: "#ffe4b8", glow: 0.25, shade: 0.42, brightness: 0.9, contrast: 0.12, saturation: -0.05, lightPosition: [1.5, 130, 70] },
  2: { x: "31%", y: "43%", color: "#d9edff", glow: 0.2, shade: 0.38, brightness: 0.94, contrast: 0.1, saturation: -0.12, lightPosition: [1.5, 250, 68] },
  3: { x: "69%", y: "44%", color: "#ffe0ad", glow: 0.28, shade: 0.4, brightness: 0.92, contrast: 0.15, saturation: 0.03, lightPosition: [1.5, 118, 72] },
};

const MARKERS: LngLatLike[] = [[8, 15], [8, 46.5], [122, -2]];

function createMapStyle(): StyleSpecification {
  const key = import.meta.env.VITE_MAPTILER_KEY;
  if (!key) {
    console.warn("VITE_MAPTILER_KEY is missing; satellite tiles will not load.");
  }

  return {
    version: 8,
    projection: { type: "globe" },
    sources: {
      satellite: {
        type: "raster",
        url: `https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=${encodeURIComponent(key ?? "")}`,
        tileSize: 256,
      },
    },
    sky: {
      "sky-color": "#050706",
      "sky-horizon-blend": 0.14,
      "horizon-color": "#1a211d",
      "horizon-fog-blend": 0.18,
      "fog-color": "#0b100d",
      "fog-ground-blend": 0.12,
      "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 0.72, 5, 0.3, 8, 0],
    },
    light: {
      anchor: "map",
      position: LIGHTING_BEATS[0].lightPosition,
      color: LIGHTING_BEATS[0].color,
      intensity: 0.62,
    },
    layers: [
      { id: "space", type: "background", paint: { "background-color": "#050706" } },
      {
        id: "satellite",
        type: "raster",
        source: "satellite",
        paint: {
          "raster-brightness-min": 0.02,
          "raster-brightness-max": LIGHTING_BEATS[0].brightness,
          "raster-contrast": LIGHTING_BEATS[0].contrast,
          "raster-saturation": LIGHTING_BEATS[0].saturation,
          "raster-fade-duration": 450,
          "raster-brightness-max-transition": { duration: 1900, delay: 0 },
          "raster-contrast-transition": { duration: 1900, delay: 0 },
          "raster-saturation-transition": { duration: 1900, delay: 0 },
        },
      },
    ],
  };
}

function cameraOffset(beat: number): [number, number] {
  const mobile = window.innerWidth < 700;
  if (mobile) return beat === 0 ? [0, window.innerHeight * 0.13] : [0, -window.innerHeight * 0.08];
  if (beat === 0) return [window.innerWidth * 0.2, window.innerHeight * 0.06];
  if (beat === 2) return [-window.innerWidth * 0.2, 0];
  return [window.innerWidth * 0.2, 0];
}

function cameraBeat(beat: number): CameraBeat {
  const base = CAMERA_BEATS[beat] ?? CAMERA_BEATS[0];
  if (beat === 0 && window.innerWidth < 700) return { ...base, zoom: 0.5 };
  return base;
}

export default function Globe() {
  const shellRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let animationFrame = 0;
    let flying = false;
    let activeBeat = 0;
    let flyTimer = 0;
    let pointerX = 0;
    let baseBearing = CAMERA_BEATS[0].bearing;

    const initialCamera = cameraBeat(0);
    const map: MapLibreMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: createMapStyle(),
      center: initialCamera.center,
      zoom: initialCamera.zoom,
      bearing: initialCamera.bearing,
      attributionControl: { compact: false },
      interactive: false,
      renderWorldCopies: false,
    });

    const applyLighting = (beatNumber: number) => {
      const lighting = LIGHTING_BEATS[beatNumber] ?? LIGHTING_BEATS[0];
      if (lightRef.current) {
        lightRef.current.style.left = lighting.x;
        lightRef.current.style.top = lighting.y;
        lightRef.current.style.opacity = String(lighting.glow);
        lightRef.current.style.setProperty("--glow-color", lighting.color);
      }
      if (shadeRef.current) {
        shadeRef.current.style.left = lighting.x;
        shadeRef.current.style.top = lighting.y;
        shadeRef.current.style.opacity = String(lighting.shade);
      }
      if (!map.isStyleLoaded()) return;
      map.setLight({ anchor: "map", position: lighting.lightPosition, color: lighting.color, intensity: 0.62 });
      map.setPaintProperty("satellite", "raster-brightness-max", lighting.brightness);
      map.setPaintProperty("satellite", "raster-contrast", lighting.contrast);
      map.setPaintProperty("satellite", "raster-saturation", lighting.saturation);
    };

    const syncBeat = (force = false) => {
      const midpoint = window.innerHeight * 0.62;
      let nextBeat = 0;
      document.querySelectorAll<HTMLElement>("[data-beat]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < midpoint && rect.bottom > midpoint * 0.25) nextBeat = Number(element.dataset.beat);
      });

      if (!force && nextBeat === activeBeat) return;
      activeBeat = nextBeat;
      const beat = cameraBeat(activeBeat);
      baseBearing = beat.bearing;
      flying = true;
      applyLighting(activeBeat);
      map.easeTo({ ...beat, offset: cameraOffset(activeBeat), duration: 2200, essential: true });
      window.clearTimeout(flyTimer);
      flyTimer = window.setTimeout(() => { flying = false; }, 2300);
    };

    const onScroll = () => syncBeat();
    const onResize = () => {
      map.resize();
      syncBeat(true);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
    };

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      if (flying || !map.loaded()) return;
      if (activeBeat === 0) {
        const center = map.getCenter();
        map.setCenter([center.lng + 0.008, center.lat]);
      }
      const targetBearing = baseBearing + pointerX * (activeBeat === 0 ? 8 : 4);
      const bearing = map.getBearing();
      if (Math.abs(targetBearing - bearing) > 0.05) map.setBearing(bearing + (targetBearing - bearing) * 0.04);
    };

    map.on("load", () => {
      MARKERS.forEach((position) => {
        const marker = document.createElement("div");
        marker.className = "map-marker";
        new maplibregl.Marker({ element: marker }).setLngLat(position).addTo(map);
      });
      syncBeat(true);
      animate();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(flyTimer);
      map.remove();
    };
  }, []);

  return (
    <div ref={shellRef} className="globe" aria-hidden="true">
      <div ref={mapContainerRef} className="globe-map" />
      <div ref={shadeRef} className="globe-shade" />
      <div ref={lightRef} className="globe-light" />
    </div>
  );
}
