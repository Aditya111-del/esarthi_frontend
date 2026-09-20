import React, { useState } from "react";
import {
  Building,
  Users,
  UserPlus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Search,
  Eye,
  Edit2,
  Trash2,
  Zap,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { DashboardStats, Employee, Shop, UserSession } from "../../types";
import ecoplugDayImage from "../../assets/ecoplug-day-station.jpeg";
import ecoplugBusImage from "../../assets/ecoplug-bus-fleet.jpeg";
import ecoplugNightImage from "../../assets/ecoplug-night-hub.jpeg";

export function getStationImage(shop?: Partial<Shop> | null, index = 0): string {
  if (shop?.shopImage) return shop.shopImage;
  if (shop?.image) return shop.image;
  if (!shop) return ecoplugDayImage;
  const text = `${shop.name || ""} ${shop.city || ""}`.toLowerCase();
  if (text.includes("fleet") || text.includes("bus") || text.includes("mumbai") || text.includes("bkc")) {
    return ecoplugBusImage;
  }
  if (text.includes("connaught") || text.includes("delhi") || text.includes("plaza")) {
    return ecoplugDayImage;
  }
  if (text.includes("bengaluru") || text.includes("silicon") || text.includes("hitec") || text.includes("express")) {
    return ecoplugNightImage;
  }
  const list = [ecoplugNightImage, ecoplugDayImage, ecoplugBusImage];
  return list[index % list.length];
}

interface AnalyticsOverviewProps {
  stats: DashboardStats | null;
  employees: Employee[];
  shops: Shop[];
  currentUser: UserSession | null;
  isSuperadmin: boolean;
  onOpenAddEmployeeForShop: (shop: Shop) => void;
  onOpenCreateShop: () => void;
  onEditShop: (shop: Shop) => void;
  onDeleteShop: (id: string) => void;
  onViewEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  stats,
  employees,
  shops,
  currentUser,
  isSuperadmin,
  onOpenAddEmployeeForShop,
  onOpenCreateShop,
  onEditShop,
  onDeleteShop,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
}) => {
  const isShopAdmin = currentUser?.type === "shopadmin";

  const assignedShop = isShopAdmin
    ? shops.find(
        (s) =>
          s._id === currentUser.assignedShopId ||
          (currentUser.assignedShopName && s.name.toLowerCase() === currentUser.assignedShopName.toLowerCase()) ||
          (currentUser.email && s.adminEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser.name && s.adminName?.toLowerCase() === currentUser.name.toLowerCase())
      ) || shops[0]
    : null;

  const [selectedStore, setSelectedStore] = useState<Shop | null>(null);
  const [storeSearch, setStoreSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  const activeStore = isShopAdmin ? assignedShop : selectedStore;

  const totalEmployees = stats?.totalEmployees ?? employees.length;
  const activeEmployees = stats?.activeEmployees ?? employees.filter((e) => e.status === "Active").length;
  const totalPower = stats?.totalPowerCapacityKw ?? 1380;
  const totalBays = stats?.totalChargingBays ?? 46;

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.city.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.adminName.toLowerCase().includes(storeSearch.toLowerCase())
  );

  const storeEmployees = activeStore
    ? employees.filter(
        (e) =>
          e.shopId === activeStore._id ||
          (activeStore.code && e.shopId === activeStore.code.toLowerCase()) ||
          (e.shopName && activeStore.name && e.shopName.toLowerCase() === activeStore.name.toLowerCase()) ||
          (activeStore.city && e.shopName?.toLowerCase().includes(activeStore.city.toLowerCase()))
      )
    : [];

  const filteredStoreEmployees = storeEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.roleTitle.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.department.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="fade-in">
      {/* ========================================================================= */}
      {/* MODE 1: ALL STORES & GLOBAL DASHBOARD OVERVIEW (Superadmin View)          */}
      {/* ========================================================================= */}
      {!activeStore ? (
        <>
          {/* Executive Network Showcase Hero */}
          <div className="es-card es-hero-board">
            {/* Background Visual with Film-Grade Vignette */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              <img
                src={ecoplugNightImage}
                alt="ESARTHI EV Infrastructure"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 40%",
                  filter: "brightness(0.38) contrast(1.15)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, oklch(0.095 0.010 240 / 0.98) 0%, oklch(0.095 0.010 240 / 0.85) 50%, oklch(0.095 0.010 240 / 0.45) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(0deg, oklch(0.095 0.010 240) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Content Overlay */}
            <div className="es-hero-content">
              <div style={{ maxWidth: "42rem" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    background: "oklch(0.155 0.012 240 / 0.85)",
                    border: "1px solid oklch(0.240 0.012 240 / 0.60)",
                    backdropFilter: "blur(12px)",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span className="es-dot" />
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: "oklch(0.760 0.150 155)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    ECOPLUG Energy India · Fast Grid
                  </span>
                </div>

                <h1
                  className="es-hero-title"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "clamp(1.375rem, 3vw, 2.25rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "oklch(0.980 0.005 240)",
                    lineHeight: 1.15,
                    margin: "0 0 0.375rem",
                  }}
                >
                  ESARTHI Workforce & Grid
                </h1>

                <p
                  className="es-hero-desc"
                  style={{
                    fontSize: "0.8125rem",
                    lineHeight: 1.5,
                    color: "oklch(0.650 0.012 240)",
                    margin: "0 0 1rem",
                    maxWidth: "34rem",
                  }}
                >
                  Workforce dispatch & charging grid operations. Oversee certified high-voltage field
                  technicians and manage multi-city store capacity.
                </p>

                {/* Telemetry Pills */}
                <div className="es-telemetry-strip" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                  <div
                    className="es-telemetry-pill"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "7px",
                      background: "oklch(0.120 0.012 240 / 0.85)",
                      border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.75rem",
                      color: "oklch(0.850 0.150 80)",
                    }}
                  >
                    <Zap size={12} style={{ fill: "currentColor" }} />
                    <span><strong>{totalPower} kW</strong> DC</span>
                  </div>

                  <div
                    className="es-telemetry-pill"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "7px",
                      background: "oklch(0.120 0.012 240 / 0.85)",
                      border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.75rem",
                      color: "oklch(0.760 0.150 155)",
                    }}
                  >
                    <span className="es-dot" />
                    <span><strong>{totalBays}</strong> Bays</span>
                  </div>

                  <div
                    className="es-telemetry-pill"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "7px",
                      background: "oklch(0.120 0.012 240 / 0.85)",
                      border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.75rem",
                      color: "oklch(0.750 0.010 240)",
                    }}
                  >
                    <Radio size={11} />
                    <span><strong>99.9%</strong> SLA</span>
                  </div>
                </div>

                {/* Header CTA Buttons: Side-by-side on both mobile and desktop */}
                <div className="es-hero-actions" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <button
                    onClick={() => onOpenAddEmployeeForShop(shops[0])}
                    className="es-btn es-btn-primary"
                    style={{ height: "2.25rem", padding: "0 1rem", fontSize: "0.8125rem" }}
                  >
                    <UserPlus size={14} />
                    Onboard Technician
                  </button>

                  {isSuperadmin && (
                    <button
                      onClick={onOpenCreateShop}
                      className="es-btn es-btn-ghost"
                      style={{ height: "2.25rem", padding: "0 1rem", fontSize: "0.8125rem" }}
                    >
                      <Plus size={14} />
                      New Hub
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top KPI Metrics: 4 columns on desktop, clean 2x2 quad on mobile */}
          <div className="es-kpi-grid">
            {/* KPI 1: Total Hubs */}
            <div className="es-card es-card-hover" style={{ padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  className="es-kpi-label"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "oklch(0.480 0.012 240)",
                  }}
                >
                  Operating Hubs
                </span>
                <div
                  className="es-kpi-icon"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "8px",
                    background: "oklch(0.680 0.158 155 / 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "oklch(0.760 0.150 155)",
                  }}
                >
                  <Building size={14} />
                </div>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <p
                  className="es-kpi-number"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "oklch(0.980 0.005 240)",
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {shops.length}
                </p>
                <div
                  style={{
                    marginTop: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.625rem",
                    color: "oklch(0.760 0.150 155)",
                  }}
                >
                  <span className="es-dot" style={{ width: "4px", height: "4px" }} />
                  <span>100% Online</span>
                </div>
              </div>
            </div>

            {/* KPI 2: Total Staff */}
            <div className="es-card es-card-hover" style={{ padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  className="es-kpi-label"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "oklch(0.480 0.012 240)",
                  }}
                >
                  Total Staff
                </span>
                <div
                  className="es-kpi-icon"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "8px",
                    background: "oklch(0.680 0.140 220 / 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "oklch(0.750 0.140 220)",
                  }}
                >
                  <Users size={14} />
                </div>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <p
                  className="es-kpi-number"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "oklch(0.980 0.005 240)",
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {totalEmployees}
                </p>
                <div
                  style={{
                    marginTop: "0.25rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.625rem",
                    color: "oklch(0.480 0.012 240)",
                  }}
                >
                  Across {shops.length} stations
                </div>
              </div>
            </div>

            {/* KPI 3: Active Duty */}
            <div className="es-card es-card-hover" style={{ padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  className="es-kpi-label"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "oklch(0.480 0.012 240)",
                  }}
                >
                  Active On-Duty
                </span>
                <div
                  className="es-kpi-icon"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "8px",
                    background: "oklch(0.680 0.158 155 / 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "oklch(0.760 0.150 155)",
                  }}
                >
                  <CheckCircle2 size={14} />
                </div>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <p
                  className="es-kpi-number"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "oklch(0.760 0.150 155)",
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {activeEmployees}
                </p>
                <div
                  style={{
                    marginTop: "0.25rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.625rem",
                    color: "oklch(0.680 0.158 155 / 0.85)",
                  }}
                >
                  Field Technicians
                </div>
              </div>
            </div>

            {/* KPI 4: Power Capacity */}
            <div className="es-card es-card-hover" style={{ padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  className="es-kpi-label"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "oklch(0.480 0.012 240)",
                  }}
                >
                  Grid Power
                </span>
                <div
                  className="es-kpi-icon"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "8px",
                    background: "oklch(0.800 0.160 80 / 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "oklch(0.850 0.150 80)",
                  }}
                >
                  <Zap size={14} style={{ fill: "currentColor" }} />
                </div>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <p
                  className="es-kpi-number"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "oklch(0.850 0.150 80)",
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {totalPower}{" "}
                  <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "oklch(0.650 0.012 240)" }}>
                    kW
                  </span>
                </p>
                <div
                  style={{
                    marginTop: "0.25rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.625rem",
                    color: "oklch(0.480 0.012 240)",
                  }}
                >
                  {totalBays} DC Fast Bays
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hubs & Stores Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.625rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid oklch(0.220 0.012 240 / 0.40)",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "oklch(0.980 0.005 240)",
                    margin: 0,
                  }}
                >
                  Operating Hubs & Stores
                </h2>
                <p style={{ fontSize: "0.6875rem", color: "oklch(0.480 0.012 240)", margin: "2px 0 0" }}>
                  Join any station to manage staff roster or register technicians
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", maxWidth: "340px" }}>
                <div className="es-search-wrap" style={{ flex: 1 }}>
                  <Search size={14} className="es-search-icon" />
                  <input
                    type="text"
                    placeholder="Search stores, city, code..."
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    className="es-input"
                    style={{ height: "2.125rem", fontSize: "0.75rem" }}
                  />
                </div>

                {isSuperadmin && (
                  <button
                    onClick={onOpenCreateShop}
                    className="es-btn es-btn-primary"
                    style={{ height: "2.125rem", fontSize: "0.75rem", padding: "0 0.75rem", flexShrink: 0 }}
                  >
                    <Plus size={13} />
                    New
                  </button>
                )}
              </div>
            </div>

            {/* Stores Cards Grid */}
            <div className="es-stores-grid">
              {filteredShops.map((shop, idx) => {
                const cleanName = shop.name
                  .replace(/^ESARTHI\s+/i, "")
                  .replace(/\s*[-—]\s*[^—-]+$/, "")
                  .trim();

                const count = employees.filter(
                  (e) =>
                    e.shopId === shop._id ||
                    e.shopId === shop.code.toLowerCase() ||
                    e.shopName?.toLowerCase().includes(shop.city.toLowerCase())
                ).length;

                return (
                  <div
                    key={shop._id}
                    className="es-card es-card-hover"
                    style={{
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      {/* Store Photo Banner */}
                      <div
                        style={{
                          position: "relative",
                          height: "120px",
                          width: "100%",
                          borderRadius: "10px",
                          overflow: "hidden",
                          marginBottom: "0.75rem",
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
                            top: "0.5rem",
                            left: "0.5rem",
                            display: "flex",
                            gap: "0.375rem",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: "0.625rem",
                              fontWeight: 600,
                              background: "oklch(0.120 0.012 240 / 0.85)",
                              color: "oklch(0.760 0.150 155)",
                              border: "1px solid oklch(0.680 0.158 155 / 0.30)",
                              backdropFilter: "blur(8px)",
                              padding: "0.125rem 0.45rem",
                              borderRadius: "5px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <Zap size={10} style={{ fill: "currentColor" }} />
                            {shop.powerCapacityKw || 240} kW
                          </span>
                          <span
                            style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: "0.625rem",
                              background: "oklch(0.120 0.012 240 / 0.85)",
                              color: "oklch(0.850 0.005 240)",
                              border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                              backdropFilter: "blur(8px)",
                              padding: "0.125rem 0.45rem",
                              borderRadius: "5px",
                            }}
                          >
                            {shop.totalBays || 8} Bays
                          </span>
                        </div>

                        {/* Bottom Info inside banner */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0.5rem",
                            left: "0.625rem",
                            right: "0.625rem",
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
                            {shop.city} Station
                          </span>
                          <span
                            style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: "0.625rem",
                              color: "oklch(0.760 0.150 155)",
                              background: "oklch(0.120 0.012 240 / 0.85)",
                              border: "1px solid oklch(0.680 0.158 155 / 0.25)",
                              padding: "0.125rem 0.45rem",
                              borderRadius: "4px",
                            }}
                          >
                            {count} Staff
                          </span>
                        </div>
                      </div>

                      {/* Store Details Header */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                            <h3
                              style={{
                                fontFamily: '"Outfit", sans-serif',
                                fontSize: "0.9375rem",
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
                                fontSize: "0.5625rem",
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
                              margin: "2px 0 0",
                            }}
                          >
                            {shop.code} · Manager: {shop.adminName}
                          </p>
                        </div>

                        {isSuperadmin && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <button
                              onClick={() => onEditShop(shop)}
                              className="es-btn es-btn-ghost"
                              style={{ width: "1.75rem", height: "1.75rem", padding: 0 }}
                              title="Edit Store"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => onDeleteShop(shop._id)}
                              className="es-btn es-btn-danger"
                              style={{ width: "1.75rem", height: "1.75rem", padding: 0 }}
                              title="Delete Store"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Footer: Side-by-side buttons on mobile and desktop */}
                    <div
                      style={{
                        marginTop: "0.875rem",
                        paddingTop: "0.75rem",
                        borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          color: "oklch(0.760 0.150 155)",
                        }}
                      >
                        {count} Staff
                      </span>

                      <div style={{ display: "flex", gap: "0.375rem", flex: 1, justifyContent: "flex-end" }}>
                        <button
                          onClick={() => onOpenAddEmployeeForShop(shop)}
                          className="es-btn es-btn-ghost"
                          style={{ height: "1.875rem", padding: "0 0.5rem", fontSize: "0.75rem" }}
                        >
                          + Staff
                        </button>
                        <button
                          onClick={() => setSelectedStore(shop)}
                          className="es-btn es-btn-primary"
                          style={{ height: "1.875rem", padding: "0 0.625rem", fontSize: "0.75rem" }}
                        >
                          Join Hub <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* ========================================================================= */
        /* MODE 2: INSIDE STORE VIEW (Shop Admin View OR Superadmin Joined Store)    */
        /* ========================================================================= */
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="fade-in">
          {/* Store Visual Header */}
          {(() => {
            const cleanStoreName = activeStore.name
              .replace(/^ESARTHI\s+/i, "")
              .replace(/\s*[-—]\s*[^—-]+$/, "")
              .trim();

            return (
              <div className="es-card es-hero-board">
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                  <img
                    src={getStationImage(activeStore, 0)}
                    alt={activeStore.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.38) contrast(1.15)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, oklch(0.095 0.010 240 / 0.98) 0%, oklch(0.095 0.010 240 / 0.85) 50%, oklch(0.095 0.010 240 / 0.40) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(0deg, oklch(0.095 0.010 240) 0%, transparent 60%)",
                    }}
                  />
                </div>

                <div className="es-hero-content">
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      gap: "0.875rem",
                    }}
                  >
                    <div>
                      {!isShopAdmin && (
                        <button
                          onClick={() => {
                            setSelectedStore(null);
                            setEmployeeSearch("");
                          }}
                          className="es-btn es-btn-ghost"
                          style={{
                            height: "1.875rem",
                            padding: "0 0.625rem",
                            fontSize: "0.75rem",
                            marginBottom: "0.625rem",
                            background: "oklch(0.120 0.012 240 / 0.80)",
                            border: "1px solid oklch(0.240 0.012 240 / 0.50)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <ArrowLeft size={13} /> Back to Hubs
                        </button>
                      )}

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <h1
                          className="es-hero-title"
                          style={{
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)",
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            color: "oklch(0.980 0.005 240)",
                            margin: 0,
                          }}
                        >
                          {cleanStoreName}
                        </h1>
                        <span
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: "0.625rem",
                            fontWeight: 600,
                            background: "oklch(0.680 0.158 155 / 0.15)",
                            color: "oklch(0.760 0.150 155)",
                            border: "1px solid oklch(0.680 0.158 155 / 0.30)",
                            borderRadius: "9999px",
                            padding: "2px 8px",
                          }}
                        >
                          {isShopAdmin ? "Station Portal" : "Joined Hub"} · {activeStore.city}
                        </span>
                      </div>

                      <p
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "0.6875rem",
                          color: "oklch(0.650 0.012 240)",
                          margin: "3px 0 0",
                        }}
                      >
                        Code: {activeStore.code} · {activeStore.powerCapacityKw || 240} kW DC · {activeStore.totalBays || 8} Fast Bays
                      </p>

                      <p style={{ fontSize: "0.6875rem", color: "oklch(0.500 0.012 240)", margin: "3px 0 0" }}>
                        Manager: <strong style={{ color: "oklch(0.850 0.005 240)" }}>{activeStore.adminName}</strong>
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', marginLeft: "0.375rem" }}>
                          ({activeStore.adminPhone || activeStore.adminEmail})
                        </span>
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", maxWidth: "340px" }}>
                      <div className="es-search-wrap" style={{ flex: 1 }}>
                        <Search size={14} className="es-search-icon" />
                        <input
                          type="text"
                          placeholder="Search store staff..."
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                          className="es-input"
                          style={{ height: "2.125rem", fontSize: "0.75rem" }}
                        />
                      </div>

                      <button
                        onClick={() => onOpenAddEmployeeForShop(activeStore)}
                        className="es-btn es-btn-primary"
                        style={{ height: "2.125rem", padding: "0 0.75rem", fontSize: "0.75rem", flexShrink: 0 }}
                      >
                        <UserPlus size={13} />
                        Add Staff
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Store Telemetry Cards: 2x2 quad on mobile */}
          <div className="es-kpi-grid">
            <div className="es-card" style={{ padding: "0.875rem 1rem" }}>
              <span className="es-kpi-label" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.480 0.012 240)", textTransform: "uppercase" }}>
                Staff
              </span>
              <p className="es-kpi-number" style={{ fontFamily: '"Outfit", sans-serif', fontSize: "1.5rem", fontWeight: 800, color: "oklch(0.980 0.005 240)", margin: "3px 0 0" }}>
                {storeEmployees.length}
              </p>
              <span style={{ fontSize: "0.625rem", color: "oklch(0.420 0.012 240)" }}>Assigned personnel</span>
            </div>

            <div className="es-card" style={{ padding: "0.875rem 1rem" }}>
              <span className="es-kpi-label" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.480 0.012 240)", textTransform: "uppercase" }}>
                Active On Duty
              </span>
              <p className="es-kpi-number" style={{ fontFamily: '"Outfit", sans-serif', fontSize: "1.5rem", fontWeight: 800, color: "oklch(0.760 0.150 155)", margin: "3px 0 0" }}>
                {storeEmployees.filter((e) => e.status === "Active").length}
              </p>
              <span style={{ fontSize: "0.625rem", color: "oklch(0.760 0.150 155 / 0.70)" }}>On-site duty</span>
            </div>

            <div className="es-card" style={{ padding: "0.875rem 1rem" }}>
              <span className="es-kpi-label" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.480 0.012 240)", textTransform: "uppercase" }}>
                Power Capacity
              </span>
              <p className="es-kpi-number" style={{ fontFamily: '"Outfit", sans-serif', fontSize: "1.5rem", fontWeight: 800, color: "oklch(0.850 0.150 80)", margin: "3px 0 0" }}>
                {activeStore.powerCapacityKw || 240} kW
              </p>
              <span style={{ fontSize: "0.625rem", color: "oklch(0.420 0.012 240)" }}>DC Fast Grid</span>
            </div>

            <div className="es-card" style={{ padding: "0.875rem 1rem" }}>
              <span className="es-kpi-label" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.480 0.012 240)", textTransform: "uppercase" }}>
                Charging Bays
              </span>
              <p className="es-kpi-number" style={{ fontFamily: '"Outfit", sans-serif', fontSize: "1.5rem", fontWeight: 800, color: "oklch(0.760 0.150 155)", margin: "3px 0 0" }}>
                {activeStore.totalBays || 8}
              </p>
              <span style={{ fontSize: "0.625rem", color: "oklch(0.420 0.012 240)" }}>Fast bays</span>
            </div>
          </div>

          {/* Store Staff Section Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "oklch(0.980 0.005 240)",
                margin: 0,
              }}
            >
              Station Personnel ({filteredStoreEmployees.length})
            </h3>
          </div>

          {/* MOBILE VIEW: High-end Personnel Cards on Mobile (< 768px) */}
          <div className="es-mobile-only" style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {filteredStoreEmployees.map((emp) => (
              <div
                key={emp._id}
                className="es-card"
                style={{ padding: "0.875rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", minWidth: 0 }}>
                    {emp.image ? (
                      <img
                        src={emp.image}
                        alt={emp.name}
                        style={{ width: "2.25rem", height: "2.25rem", borderRadius: "9999px", objectFit: "cover", flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "2.25rem",
                          height: "2.25rem",
                          borderRadius: "9999px",
                          background: "oklch(0.180 0.012 240)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "oklch(0.760 0.150 155)",
                          flexShrink: 0,
                        }}
                      >
                        {emp.firstName?.[0] || emp.name?.[0] || "E"}
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <p
                        onClick={() => onViewEmployee(emp)}
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "oklch(0.980 0.005 240)",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                        }}
                      >
                        {emp.name}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "oklch(0.500 0.012 240)", margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {emp.roleTitle} · {emp.level || "L1"}
                      </p>
                    </div>
                  </div>
                  <span className={`es-badge ${emp.status === "Active" ? "es-badge-emerald" : "es-badge-amber"}`}>
                    {emp.status}
                  </span>
                </div>

                <div
                  style={{
                    paddingTop: "0.5rem",
                    borderTop: "1px solid oklch(0.220 0.012 240 / 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.6875rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    color: "oklch(0.480 0.012 240)",
                  }}
                >
                  <span>ID: <strong style={{ color: "oklch(0.760 0.150 155)" }}>{emp.employeeId}</strong></span>
                  <span>{emp.salary || "Standard"}</span>
                </div>

                <div style={{ display: "flex", gap: "0.375rem" }}>
                  <button
                    onClick={() => onViewEmployee(emp)}
                    className="es-btn es-btn-ghost"
                    style={{ flex: 1, height: "1.875rem", fontSize: "0.6875rem", justifyContent: "center" }}
                  >
                    <Eye size={12} /> View Details
                  </button>
                  <button
                    onClick={() => onEditEmployee(emp)}
                    className="es-btn es-btn-ghost"
                    style={{ height: "1.875rem", width: "1.875rem", padding: 0 }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onDeleteEmployee(emp._id)}
                    className="es-btn es-btn-danger"
                    style={{ height: "1.875rem", width: "1.875rem", padding: 0 }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
            {filteredStoreEmployees.length === 0 && (
              <div className="es-card" style={{ textAlign: "center", padding: "2.5rem 1rem", color: "oklch(0.420 0.012 240)", fontSize: "0.75rem" }}>
                No employees found in this store
              </div>
            )}
          </div>

          {/* DESKTOP VIEW: Full Data Table on Desktop (>= 768px) */}
          <div className="es-desktop-only es-table-wrap">
            <table className="es-table">
              <thead>
                <tr>
                  <th>Technician</th>
                  <th>ID</th>
                  <th>Role & Level</th>
                  <th>Department</th>
                  <th>Monthly Salary</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStoreEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        {emp.image ? (
                          <img
                            src={emp.image}
                            alt={emp.name}
                            style={{ width: "2rem", height: "2rem", borderRadius: "9999px", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "2rem",
                              height: "2rem",
                              borderRadius: "9999px",
                              background: "oklch(0.180 0.012 240)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "oklch(0.760 0.150 155)",
                            }}
                          >
                            {emp.firstName?.[0] || emp.name?.[0] || "E"}
                          </div>
                        )}
                        <div>
                          <p
                            onClick={() => onViewEmployee(emp)}
                            style={{
                              fontWeight: 600,
                              color: "oklch(0.970 0.004 240)",
                              margin: 0,
                              cursor: "pointer",
                            }}
                          >
                            {emp.name}
                          </p>
                          <p
                            style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: "0.6875rem",
                              color: "oklch(0.420 0.012 240)",
                              margin: "2px 0 0",
                            }}
                          >
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td style={{ fontFamily: '"JetBrains Mono", monospace', color: "oklch(0.760 0.150 155)", fontWeight: 600 }}>
                      {emp.employeeId}
                    </td>

                    <td>
                      <span style={{ fontWeight: 500, color: "oklch(0.900 0.005 240)" }}>{emp.roleTitle}</span>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", color: "oklch(0.420 0.012 240)", marginLeft: "0.375rem" }}>
                        ({emp.level || "L1"})
                      </span>
                    </td>

                    <td style={{ color: "oklch(0.500 0.012 240)" }}>{emp.department}</td>

                    <td style={{ color: "oklch(0.850 0.005 240)", fontWeight: 500 }}>
                      {emp.salary || "Standard"}
                    </td>

                    <td>
                      <span
                        className={`es-badge ${
                          emp.status === "Active" ? "es-badge-emerald" : "es-badge-amber"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.375rem" }}>
                        <button
                          onClick={() => onViewEmployee(emp)}
                          className="es-btn es-btn-ghost"
                          style={{ height: "1.75rem", padding: "0 0.5rem", fontSize: "0.75rem" }}
                        >
                          <Eye size={12} /> View
                        </button>
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className="es-btn es-btn-ghost"
                          style={{ height: "1.75rem", width: "1.75rem", padding: 0 }}
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee(emp._id)}
                          className="es-btn es-btn-danger"
                          style={{ height: "1.75rem", width: "1.75rem", padding: 0 }}
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStoreEmployees.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "3rem 1rem", color: "oklch(0.420 0.012 240)" }}>
                      No employees found in this store
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
