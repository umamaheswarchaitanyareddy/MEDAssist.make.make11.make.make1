import { useState } from 'react';
import EducationalBanner from './EducationalBanner';

interface Hospital {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  emergency?: string;
  distance?: number;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export default function NearbyHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [radius, setRadius] = useState(5000);

  async function fetchHospitals(lat: number, lon: number, r: number) {
    setLoading(true);
    setError(null);
    try {
      const query = `[out:json][timeout:25];(node["amenity"="hospital"](around:${r},${lat},${lon});way["amenity"="hospital"](around:${r},${lat},${lon});relation["amenity"="hospital"](around:${r},${lat},${lon}););out center;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Overpass API error');
      const data = await res.json();
      const items: Hospital[] = data.elements
        .filter((e: any) => e.tags?.name)
        .map((e: any) => {
          const eLat = e.lat ?? e.center?.lat;
          const eLon = e.lon ?? e.center?.lon;
          const tags = e.tags ?? {};
          return {
            id: e.id,
            name: tags.name ?? 'Unknown Hospital',
            lat: eLat,
            lon: eLon,
            address: [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || tags['addr:full'],
            phone: tags.phone ?? tags['contact:phone'],
            emergency: tags.emergency,
            distance: eLat && eLon ? haversine(lat, lon, eLat, eLon) : undefined,
          };
        })
        .sort((a: Hospital, b: Hospital) => (a.distance ?? 999) - (b.distance ?? 999));
      setHospitals(items);
    } catch {
      setError('Failed to load hospitals. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function locate() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setUserLocation({ lat, lon });
        fetchHospitals(lat, lon, radius);
      },
      () => {
        setLoading(false);
        setError('Location access denied. Please enable location permissions.');
      },
      { timeout: 10000 }
    );
  }

  function openInMaps(h: Hospital) {
    window.open(`https://www.openstreetmap.org/?mlat=${h.lat}&mlon=${h.lon}&zoom=16`, '_blank');
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-['DM_Serif_Display'] text-3xl text-[#f1f5f9] mb-2">Nearby Hospitals</h1>
        <p className="text-[#64748b] text-sm">Find hospitals near your location using live OpenStreetMap data.</p>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          value={radius}
          onChange={e => setRadius(Number(e.target.value))}
          className="bg-[#0f172a] border border-[#1e293b] text-[#94a3b8] text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#06b6d4]/60"
        >
          <option value={2000}>2 km radius</option>
          <option value={5000}>5 km radius</option>
          <option value={10000}>10 km radius</option>
          <option value={20000}>20 km radius</option>
        </select>
        <button
          onClick={locate}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-[#06b6d4] text-white font-semibold text-sm hover:bg-[#0891b2] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Find Nearby Hospitals
            </>
          )}
        </button>
      </div>

      {userLocation && hospitals.length > 0 && (
        <p className="text-xs text-[#64748b] mb-4">{hospitals.length} hospitals found within {radius / 1000}km</p>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {hospitals.length === 0 && !loading && userLocation && (
        <div className="text-center py-12">
          <p className="text-[#64748b] text-sm">No hospitals found in this radius.</p>
          <p className="text-[#475569] text-xs mt-1">Try increasing the search radius.</p>
        </div>
      )}

      <div className="space-y-3">
        {hospitals.map((h, i) => (
          <div key={h.id} className="p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-[#06b6d4]/30 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#06b6d4] text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <p className="font-semibold text-[#f1f5f9] text-sm leading-tight">{h.name}</p>
                  {h.address && <p className="text-[#64748b] text-xs mt-0.5">{h.address}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {h.distance !== undefined && (
                      <span className="text-xs bg-[#06b6d4]/10 text-[#06b6d4] px-2 py-0.5 rounded-md border border-[#06b6d4]/20">
                        {formatDistance(h.distance)}
                      </span>
                    )}
                    {h.emergency === 'yes' && (
                      <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-md border border-red-500/20">Emergency</span>
                    )}
                    {h.phone && <span className="text-xs text-[#64748b]">{h.phone}</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => openInMaps(h)}
                className="flex-shrink-0 p-2 rounded-lg bg-[#1e293b] hover:bg-[#06b6d4]/10 text-[#64748b] hover:text-[#06b6d4] transition-all"
                title="View on map"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <EducationalBanner className="mb-6" />

      {!userLocation && !loading && (
        <div className="rounded-2xl border border-white/5 bg-[#0f172a]/60 px-6 py-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-center">
            <svg className="w-7 h-7 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-[#64748b] text-sm">Grant location access to find hospitals near you.</p>
          <p className="text-[#475569] text-xs mt-1">Data from OpenStreetMap · updated in real-time</p>
          <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2 border-t border-white/5 pt-5">
            <div>
              <p className="text-sm font-semibold text-[#cbd5e1]">Live</p>
              <p className="mt-0.5 text-[10px] text-[#475569]">Map data</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#cbd5e1]">2–20 km</p>
              <p className="mt-0.5 text-[10px] text-[#475569]">Search radius</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#cbd5e1]">Private</p>
              <p className="mt-0.5 text-[10px] text-[#475569]">Location use</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
