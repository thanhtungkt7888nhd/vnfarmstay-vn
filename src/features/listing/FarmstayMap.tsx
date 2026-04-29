"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import type { Farmstay } from "@/shared/types/farmstay";
import { formatPrice } from "@/shared/utils/format";

interface Props {
  farmstays: Farmstay[];
}

/** Leaflet map — tích hợp từ roi-calculator.html của nhahoachdinh.vn */
export function FarmstayMap({ farmstays }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    // Lazy load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (mapInstanceRef.current) return;

      const map = L.map(mapRef.current!, {
        center: [16.0, 106.5],
        zoom: 5,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Cập nhật markers khi farmstays thay đổi
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;

    import("leaflet").then((L) => {
      // Xóa markers cũ
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const goldIcon = L.divIcon({
        html: '<div style="background:#d4a853;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: "",
      });

      farmstays.forEach((f) => {
        const marker = L.marker([f.lat, f.lng], { icon: goldIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(
            `<strong style="font-size:0.9rem">${f.name}</strong><br/>${formatPrice(f.price)}/đêm &nbsp; ${f.rating}★`,
            { maxWidth: 220 }
          );
        markersRef.current.push(marker);
      });
    });
  }, [farmstays]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", minHeight: 400 }}
      aria-label="Bản đồ vị trí farmstay"
    />
  );
}
