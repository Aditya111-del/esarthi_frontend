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
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { DashboardStats, Employee, Shop, UserSession } from "../../types";
import ecoplugDayImage from "../../assets/ecoplug-day-station.jpeg";
import ecoplugBusImage from "../../assets/ecoplug-bus-fleet.jpeg";
import ecoplugNightImage from "../../assets/ecoplug-night-hub.jpeg";

export function getStationImage(shop?: Partial<Shop> | null, index = 0): string {
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
  // Check if current user is Shop Admin
  const isShopAdmin = currentUser?.type === "shopadmin";

  // If Shop Admin, automatically lock to their assigned store
  const assignedShop = isShopAdmin
    ? shops.find(
        (s) =>
          s._id === currentUser.assignedShopId ||
          (currentUser.assignedShopName && s.name.toLowerCase() === currentUser.assignedShopName.toLowerCase()) ||
          (currentUser.email && s.adminEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser.name && s.adminName?.toLowerCase() === currentUser.name.toLowerCase())
      ) || shops[0]
    : null;

  // State for joined store view (Superadmin can join any store)
  const [selectedStore, setSelectedStore] = useState<Shop | null>(null);
  const [storeSearch, setStoreSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  // Active store:
  // For a Shop Admin, it is ALWAYS their assigned store (no multi-shop overview)
  // For a Superadmin, it is whatever store they joined (selectedStore) or null for all shops
  const activeStore = isShopAdmin ? assignedShop : selectedStore;

  const totalEmployees = stats?.totalEmployees ?? employees.length;
  const activeEmployees = stats?.activeEmployees ?? employees.filter((e) => e.status === "Active").length;
  const totalPower = stats?.totalPowerCapacityKw ?? 1380;
  const totalBays = stats?.totalChargingBays ?? 46;

  // Filtered stores for Superadmin overview
  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.city.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.adminName.toLowerCase().includes(storeSearch.toLowerCase())
  );

  // Employees for currently active store
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
    <div className="space-y-6 rise">
      {/* ========================================================================= */}
      {/* MODE 1: ALL STORES & GLOBAL DASHBOARD OVERVIEW (Superadmin Only)          */}
      {/* ========================================================================= */}
      {!activeStore ? (
        <>
          {/* Visual Upper Image Board with EV Charging Hub Showcase */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Background Image with Dark Vignette Gradient */}
            <div className="absolute inset-0 z-0">
              <img
                src={ecoplugNightImage}
                alt="ECOPLUG Energy India EV Charging Network"
                className="h-full w-full object-cover object-center brightness-60 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-2xl space-y-2.5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 font-mono text-[11px] font-semibold text-primary backdrop-blur-md">
                    <span>ECOPLUG Energy India Limited · National EV Fast-Charging Grid</span>
                  </div>

                  <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
                    ESARTHI EV Power Network
                  </h1>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-normal max-w-xl">
                    Enterprise workforce and charging grid operations: Monitor 400V/800V DC fast chargers, dispatch certified high-voltage field technicians, and optimize multi-city store capacity.
                  </p>

                  {/* Live Telemetry Pills */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                      <Zap size={14} className="text-amber-400 fill-amber-400" />
                      <span className="font-mono text-xs text-white">
                        <strong>{totalPower} kW</strong> Connected Load
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                      <span className="text-emerald-400 font-bold">⚡</span>
                      <span className="font-mono text-xs text-white">
                        <strong>{totalBays}</strong> Charging Bays
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                      <span className="text-emerald-400 font-bold">●</span>
                      <span className="font-mono text-xs text-white">
                        <strong>99.9%</strong> Network SLA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => onOpenAddEmployeeForShop(shops[0])}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 cursor-pointer"
                  >
                    <UserPlus size={15} />
                    Onboard Technician
                  </button>

                  {isSuperadmin && (
                    <button
                      onClick={onOpenCreateShop}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/40 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-black/60 cursor-pointer"
                    >
                      <Plus size={15} />
                      New Store
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top Dashboard Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Total Stores</span>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">{shops.length}</p>
              <span className="text-[11px] text-muted-foreground">Operating locations</span>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Total Employees</span>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">{totalEmployees}</p>
              <span className="text-[11px] text-muted-foreground">Across all stores</span>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Active On Duty</span>
              <p className="mt-1 font-display text-2xl font-bold text-emerald-400">{activeEmployees}</p>
              <span className="text-[11px] text-muted-foreground">Verified staff</span>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Network Capacity</span>
              <p className="mt-1 font-display text-2xl font-bold text-amber-400">{totalPower} kW</p>
              <span className="text-[11px] text-muted-foreground">{totalBays} Charging Bays</span>
            </div>
          </div>

          {/* Stores Directory Section */}
          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-border pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Operating Stores & Hubs
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select any store to join, view all assigned employees, or add new staff
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Filter stores..."
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    className="h-9 w-44 sm:w-56 rounded-lg border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  />
                </div>

                {isSuperadmin && (
                  <button
                    onClick={onOpenCreateShop}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus size={14} />
                    New Store
                  </button>
                )}
              </div>
            </div>

            {/* Stores Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2">
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
                    className="rounded-xl border border-border bg-card/70 p-5 hover:border-primary/40 transition-all flex flex-col justify-between group overflow-hidden"
                  >
                    <div>
                      {/* Store Visual Header Banner */}
                      <div className="relative h-28 w-full overflow-hidden rounded-lg mb-3">
                        <img
                          src={getStationImage(shop, idx)}
                          alt={shop.name}
                          className="h-full w-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 font-mono text-[9.5px] font-bold text-emerald-400 border border-emerald-500/20">
                            ⚡ {shop.powerCapacityKw || 300} kW DC
                          </span>
                          <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 font-mono text-[9.5px] text-slate-200">
                            {shop.totalBays || 10} Bays
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="font-display text-xs font-bold text-white tracking-wide drop-shadow">
                            {shop.city} Station
                          </span>
                          <span className="font-mono text-[10px] text-emerald-300 font-semibold drop-shadow">
                            {count} Staff on duty
                          </span>
                        </div>
                      </div>

                      {/* Store Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                              {cleanName}
                            </span>
                            <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                              {shop.city}
                            </span>
                          </div>
                          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                            {shop.code} · {shop.powerCapacityKw || 240} kW DC · {shop.totalBays || 8} Fast Bays
                          </p>
                        </div>

                        {isSuperadmin && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onEditShop(shop)}
                              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded"
                              title="Edit Store Particulars"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => onDeleteShop(shop._id)}
                              className="p-1 text-muted-foreground hover:text-destructive cursor-pointer rounded"
                              title="Delete Store"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Store Manager Info */}
                      <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Manager / Admin:</span> {shop.adminName}
                        <span className="ml-2 font-mono text-[11px]">({shop.adminPhone || shop.adminEmail})</span>
                      </div>
                    </div>

                    {/* Store Card Actions */}
                    <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {count} {count === 1 ? "Employee" : "Employees"}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenAddEmployeeForShop(shop)}
                          className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                        >
                          + Add Employee
                        </button>
                        <button
                          onClick={() => setSelectedStore(shop)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                        >
                          Join Store <ArrowRight size={12} />
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
        /* MODE 2: INSIDE STORE VIEW (Shop Admin Portal OR Superadmin Joined Store)   */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Back Navigation & Store Upper Image Board */}
          {(() => {
            const cleanStoreName = activeStore.name
              .replace(/^ESARTHI\s+/i, "")
              .replace(/\s*[-—]\s*[^—-]+$/, "")
              .trim();

            return (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
                <div className="absolute inset-0 z-0">
                  <img
                    src={getStationImage(activeStore, 0)}
                    alt={activeStore.name}
                    className="h-full w-full object-cover object-center brightness-60 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>

                <div className="relative z-10 p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      {!isShopAdmin && (
                        <button
                          onClick={() => {
                            setSelectedStore(null);
                            setEmployeeSearch("");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white hover:bg-black/60 transition-colors cursor-pointer mb-3 backdrop-blur-md"
                        >
                          <ArrowLeft size={14} /> Back to All Stores
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                          {cleanStoreName}
                        </h2>
                        <span className="rounded bg-primary/20 border border-primary/40 px-2 py-0.5 font-mono text-[10px] text-primary font-bold">
                          {isShopAdmin ? "Store Admin Portal" : "Joined Store View"} · {activeStore.city}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-300 font-mono">
                        Station Code: {activeStore.code} · {activeStore.powerCapacityKw || 300} kW DC · {activeStore.totalBays || 10} Fast Bays
                      </p>

                      <div className="mt-2 text-xs text-slate-300">
                        <span className="text-white font-medium">Store Manager:</span> {activeStore.adminName}
                        <span className="ml-2 font-mono text-[11px] text-slate-400">({activeStore.adminPhone || activeStore.adminEmail})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search store staff..."
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                          className="h-9 w-48 rounded-lg border border-white/20 bg-black/50 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 focus:border-primary/60 focus:outline-none backdrop-blur-md"
                        />
                      </div>

                      <button
                        onClick={() => onOpenAddEmployeeForShop(activeStore)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-md"
                      >
                        <UserPlus size={14} />
                        Add Employee to this Store
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Store Quick Telemetry KPI Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Store Employees</span>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">{storeEmployees.length}</p>
              <span className="text-[11px] text-muted-foreground">Assigned to this store</span>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Active On Duty</span>
              <p className="mt-1 font-display text-2xl font-bold text-emerald-400">
                {storeEmployees.filter((e) => e.status === "Active").length}
              </p>
              <span className="text-[11px] text-muted-foreground">Verified staff</span>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Power Capacity</span>
              <p className="mt-1 font-display text-2xl font-bold text-amber-400">{activeStore.powerCapacityKw || 300} kW</p>
              <span className="text-[11px] text-muted-foreground">DC Ultra-Fast Load</span>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Charging Bays</span>
              <p className="mt-1 font-display text-2xl font-bold text-emerald-400">{activeStore.totalBays || 10}</p>
              <span className="text-[11px] text-muted-foreground">Operating stalls</span>
            </div>
          </div>

          {/* Store Employees Table Section Header */}
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Store Employee Roster ({filteredStoreEmployees.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                {isShopAdmin
                  ? `Viewing personnel assigned to your store: ${activeStore.name}`
                  : `Personnel assigned exclusively to ${activeStore.name}`}
              </p>
            </div>
          </div>

          {/* Store Employees Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-card/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-secondary/40 font-mono text-[10px] uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Employee ID</th>
                    <th className="px-4 py-3">Role & Level</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Monthly Salary</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredStoreEmployees.length > 0 ? (
                    filteredStoreEmployees.map((emp) => (
                      <tr key={emp._id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {emp.image ? (
                              <img
                                src={emp.image}
                                alt={emp.name}
                                className="size-8 rounded-full object-cover border border-border"
                              />
                            ) : (
                              <div className="flex size-8 items-center justify-center rounded-full bg-secondary font-bold text-foreground">
                                {emp.firstName?.[0] || emp.name?.[0] || "E"}
                              </div>
                            )}
                            <div>
                              <p
                                onClick={() => onViewEmployee(emp)}
                                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors"
                              >
                                {emp.name}
                              </p>
                              <p className="font-mono text-[10px] text-muted-foreground">{emp.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-mono text-primary font-semibold">
                          {emp.employeeId}
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">{emp.roleTitle}</span>
                          <span className="ml-1 text-muted-foreground font-mono text-[10px]">({emp.level || "L3"})</span>
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {emp.department}
                        </td>

                        <td className="px-4 py-3 font-medium text-foreground">
                          {emp.salary || "Standard"}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${
                              emp.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onViewEmployee(emp)}
                              className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                              title="View Full Details"
                            >
                              View Full Details
                            </button>
                            <button
                              onClick={() => onEditEmployee(emp)}
                              className="rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => onDeleteEmployee(emp._id)}
                              className="rounded p-1 text-muted-foreground hover:text-destructive cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                        No employees found in {selectedStore.name}.
                        <div className="mt-2">
                          <button
                            onClick={() => onOpenAddEmployeeForShop(selectedStore)}
                            className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                          >
                            + Add Employee Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
