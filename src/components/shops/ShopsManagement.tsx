import React, { useState } from "react";
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  ShieldCheck,
  ArrowRight,
  Radio,
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="fade-in">
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "oklch(0.980 0.005 240)",
                margin: 0,
              }}
            >
              Charging Hubs & Station Stores
            </h1>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.6875rem",
                fontWeight: 600,
                background: "oklch(0.155 0.012 240)",
                color: "oklch(0.760 0.150 155)",
                border: "1px solid oklch(0.680 0.158 155 / 0.20)",
                borderRadius: "9999px",
                padding: "2px 8px",
              }}
            >
              {shops.length} Active
            </span>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "oklch(0.500 0.012 240)", margin: "4px 0 0" }}>
            {totalPower} kW Total Grid Load · {activeBays}/{totalBays} Bays Online · 99.8% Network SLA
          </p>
        </div>

        <div className="es-shops-header-actions" style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div className="es-search-wrap" style={{ flex: "1 1 200px" }}>
            <Search size={14} className="es-search-icon" />
            <input
              type="text"
              placeholder="Search station, city, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="es-input"
              style={{ height: "2.25rem", fontSize: "0.8125rem" }}
            />
          </div>

          <button
            onClick={onOpenCreateShop}
            className="es-btn es-btn-primary"
            style={{ height: "2.25rem", padding: "0 0.875rem", fontSize: "0.8125rem", flexShrink: 0 }}
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Station</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Stations Cards Grid */}
      <div className="es-stores-grid">
        {filteredShops.map((shop, idx) => {
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
              className="es-card es-card-hover"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* Station Photo Banner */}
                <div
                  style={{
                    position: "relative",
                    height: "150px",
                    width: "100%",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "1rem",
                    border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                  }}
                >
                  <img
                    src={getStationImage(shop, idx)}
                    alt={shop.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.70) contrast(1.10)",
                      transition: "transform 0.4s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(0deg, oklch(0.095 0.010 240 / 0.90) 0%, transparent 65%)",
                    }}
                  />

                  {/* Top Badges */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.625rem",
                      left: "0.625rem",
                      display: "flex",
                      gap: "0.375rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        background: "oklch(0.120 0.012 240 / 0.85)",
                        color: "oklch(0.850 0.150 80)",
                        border: "1px solid oklch(0.800 0.160 80 / 0.30)",
                        backdropFilter: "blur(8px)",
                        padding: "0.1875rem 0.5rem",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <Zap size={10} style={{ fill: "currentColor" }} />
                      {cap} kW DC
                    </span>
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.6875rem",
                        background: "oklch(0.120 0.012 240 / 0.85)",
                        color: "oklch(0.850 0.005 240)",
                        border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                        backdropFilter: "blur(8px)",
                        padding: "0.1875rem 0.5rem",
                        borderRadius: "6px",
                      }}
                    >
                      {shop.city} Hub
                    </span>
                  </div>

                  <div style={{ position: "absolute", top: "0.625rem", right: "0.625rem" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        padding: "0.1875rem 0.5rem",
                        borderRadius: "9999px",
                        background: "oklch(0.120 0.012 240 / 0.85)",
                        border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                        backdropFilter: "blur(8px)",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.6875rem",
                        color: "oklch(0.760 0.150 155)",
                      }}
                    >
                      <span className="es-dot" />
                      Online
                    </span>
                  </div>

                  {/* Bottom Info inside banner */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.625rem",
                      left: "0.75rem",
                      right: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "oklch(0.980 0.005 240)",
                      }}
                    >
                      ECOPLUG · {shop.code}
                    </span>
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.6875rem",
                        color: "oklch(0.760 0.150 155)",
                      }}
                    >
                      SLA: {shop.uptimePercent || 99.8}%
                    </span>
                  </div>
                </div>

                {/* Station Title & Status */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <h3
                        style={{
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: "1.0625rem",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          color: "oklch(0.980 0.005 240)",
                          margin: 0,
                        }}
                      >
                        {cleanName}
                      </h3>
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "0.625rem",
                          background: "oklch(0.155 0.012 240)",
                          color: "oklch(0.760 0.150 155)",
                          border: "1px solid oklch(0.680 0.158 155 / 0.20)",
                          borderRadius: "4px",
                          padding: "1px 5px",
                        }}
                      >
                        {shop.city}
                      </span>
                    </div>

                    <p
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.6875rem",
                        color: "oklch(0.480 0.012 240)",
                        margin: "4px 0 0",
                      }}
                    >
                      Code: {shop.code} · Manager: {shop.adminName}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <button
                      onClick={() => onEditShop(shop)}
                      className="es-btn es-btn-ghost"
                      style={{ width: "1.875rem", height: "1.875rem", padding: 0 }}
                      title="Edit Station"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => onDeleteShop(shop._id)}
                      className="es-btn es-btn-danger"
                      style={{ width: "1.875rem", height: "1.875rem", padding: 0 }}
                      title="Delete Station"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Corporate Admin ID bar */}
                <div
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.5rem 0.625rem",
                    borderRadius: "8px",
                    background: "oklch(0.100 0.010 240)",
                    border: "1px solid oklch(0.220 0.012 240 / 0.50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", overflow: "hidden" }}>
                    <ShieldCheck size={13} style={{ color: "oklch(0.680 0.158 155)", flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.6875rem",
                        color: "oklch(0.900 0.005 240)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {shop.adminEmail || `${shop.city.toLowerCase().replace(/\s+/g, "")}.admin@esarthi.com`}
                    </span>
                  </div>
                  <button
                    onClick={() => onSwitchToShopAdmin(shop)}
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: "oklch(0.760 0.150 155)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Login As Admin →
                  </button>
                </div>

                {/* Power & Live Bay Occupancy */}
                <div
                  style={{
                    marginTop: "0.875rem",
                    paddingTop: "0.875rem",
                    borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.375rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.6875rem",
                    }}
                  >
                    <span style={{ color: "oklch(0.850 0.150 80)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <Zap size={11} style={{ fill: "currentColor" }} />
                      {cap} kW DC
                    </span>
                    <span style={{ color: "oklch(0.480 0.012 240)" }}>
                      {actBays}/{totBays} Bays Online ({pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: "4px",
                      width: "100%",
                      borderRadius: "9999px",
                      background: "oklch(0.155 0.012 240)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: "9999px",
                        background: pct > 80 ? "oklch(0.850 0.150 80)" : "oklch(0.680 0.158 155)",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "0.875rem",
                  borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={() => onViewShopStaff(shop._id)}
                  className="es-btn es-btn-ghost"
                  style={{ height: "2rem", padding: "0 0.625rem", fontSize: "0.75rem" }}
                >
                  <Users size={13} />
                  {shop.employeeCount || 0} Technicians
                </button>

                <button
                  onClick={() => onSwitchToShopAdmin(shop)}
                  className="es-btn es-btn-primary"
                  style={{ height: "2rem", padding: "0 0.75rem", fontSize: "0.75rem" }}
                >
                  Manage Station <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
        {filteredShops.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "4rem 1rem",
              color: "oklch(0.420 0.012 240)",
              fontSize: "0.8125rem",
            }}
          >
            No charging hubs match your search query
          </div>
        )}
      </div>
    </div>
  );
};
