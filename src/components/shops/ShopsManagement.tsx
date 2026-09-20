import React, { useState } from "react";
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  Users,
  MapPin,
  ArrowRight,
  Search,
} from "lucide-react";
import { Shop } from "../../types";
import { getStationImage } from "../analytics/AnalyticsOverview";

interface ShopsManagementProps {
  shops: Shop[];
  onOpenCreateShop: () => void;
  onEditShop: (shop: Shop) => void;
  onDeleteShop: (id: string) => void;
  onViewShopStaff: (shopId: string) => void;
  onSwitchToShopAdmin: (shop: Shop) => void;
}

export const ShopsManagement: React.FC<ShopsManagementProps> = ({
  shops,
  onOpenCreateShop,
  onEditShop,
  onDeleteShop,
  onViewShopStaff,
  onSwitchToShopAdmin,
}) => {
  const [search, setSearch] = useState("");

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.adminName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPower = shops.reduce((sum, s) => sum + (s.powerCapacityKw || 240), 0);
  const totalBays = shops.reduce((sum, s) => sum + (s.totalBays || 8), 0);
  const activeBays = shops.reduce((sum, s) => sum + (s.activeBays || 6), 0);

  return (
    <div className="space-y-6 rise">
      {/* Minimal Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Charging Hubs
          </h2>
          <p className="text-xs text-muted-foreground">
            {shops.length} Active Stations · {totalPower} kW Total Power · {activeBays}/{totalBays} Bays Online
          </p>
        </div>

        <button
          onClick={onOpenCreateShop}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Plus size={15} />
          New Station
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter stations by city, name, or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9.5 w-full rounded-xl border border-border bg-card/70 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
        />
      </div>

      {/* Minimalist Stations Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
        {filteredShops.map((shop, idx) => {
          // Clean name: strip "ESARTHI " and trailing " — City"
          const cleanName = shop.name
            .replace(/^ESARTHI\s+/i, "")
            .replace(/\s*[-—]\s*[^—-]+$/, "")
            .trim();

          const cap = shop.powerCapacityKw || 240;
          const totBays = shop.totalBays || 8;
          const actBays = shop.activeBays || 6;
          const pct = Math.round((actBays / totBays) * 100);

          return (
            <div
              key={shop._id}
              className="rounded-2xl border border-border bg-card/80 p-5 transition-all hover:border-primary/50 hover:bg-card shadow-sm flex flex-col justify-between group overflow-hidden"
            >
              <div>
                {/* Station Visual Banner */}
                <div className="relative h-36 w-full overflow-hidden rounded-xl mb-4">
                  <img
                    src={getStationImage(shop, idx)}
                    alt={shop.name}
                    className="h-full w-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Zap size={10} className="fill-emerald-400" /> {cap} kW DC
                    </span>
                    <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] text-slate-200">
                      {shop.city} Hub
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 font-mono text-[10px] text-emerald-400 font-medium border border-white/10">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      {shop.status === "active" ? "Online" : "Inactive"}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-white tracking-wide">
                      ECOPLUG · {shop.code}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-300 font-medium">
                      SLA: {shop.uptimePercent || 99.8}%
                    </span>
                  </div>
                </div>

                {/* Station Title & Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {cleanName}
                    </span>
                    <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[9.5px] text-muted-foreground">
                      {shop.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditShop(shop)}
                      className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                      title="Edit Station"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteShop(shop._id)}
                      className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors cursor-pointer"
                      title="Delete Station"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Subtitle / Code */}
                <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                  <span>{shop.code}</span>
                  <span>·</span>
                  <span>Lead: {shop.adminName}</span>
                </div>

                {/* Power & Live Bay Occupancy Bar */}
                <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Zap size={13} className="fill-amber-400" />
                      {cap} kW DC
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{actBays}/{totBays} Bays</span>
                      <span className={pct > 80 ? "text-amber-400 font-bold" : "text-emerald-400 font-semibold"}>
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Slim Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 80 ? "bg-amber-400" : "bg-emerald-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Minimal Footer */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                <button
                  onClick={() => onViewShopStaff(shop._id)}
                  className="font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Users size={13} />
                  {shop.employeeCount || 0} Technicians
                </button>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10.5px] text-muted-foreground">
                    {shop.uptimePercent || 99.8}% Uptime
                  </span>
                  <button
                    onClick={() => onSwitchToShopAdmin(shop)}
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5 text-xs cursor-pointer"
                  >
                    Manage Station <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
