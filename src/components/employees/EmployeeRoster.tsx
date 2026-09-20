import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  Phone,
  Mail,
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  Shield,
} from "lucide-react";
import { Employee, Shop } from "../../types";

interface EmployeeRosterProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (d: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  selectedShop: string;
  onShopChange: (shopId: string) => void;
  departments: string[];
  shops: Shop[];
  onViewEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onOpenAddModal: () => void;
}

export const EmployeeRoster: React.FC<EmployeeRosterProps> = ({
  employees,
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  selectedShop,
  onShopChange,
  departments,
  shops,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onOpenAddModal,
}) => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  return (
    <div className="space-y-6 rise">
      {/* Header bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-primary uppercase font-bold">
            <Zap size={12} className="text-amber-400" />
            FIELD WORKFORCE · CERTIFIED EV TECHNICIANS & LEADS
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            EV Technicians & Operations Roster
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Total {employees.length} personnel: High-voltage diagnostics engineers, OCPP cloud specialists, station superintendents, and safety auditors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-border bg-card p-1 shadow-sm">
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-accent text-primary font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-accent text-primary font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] cursor-pointer"
          >
            <UserPlus size={15} />
            Add EV Technician
          </button>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="grid gap-3 sm:grid-cols-12">
        {/* Search */}
        <div className="relative sm:col-span-4">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search technician name, ID, role, or bay..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card/80 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>

        {/* Station Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedShop}
            onChange={(e) => onShopChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card/80 px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none cursor-pointer"
          >
            <option value="all">All Charging Stations</option>
            {shops.map((s) => (
              <option key={s._id} value={s._id}>
                {s.city}: {s.name.replace("ESARTHI ", "")}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card/80 px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none cursor-pointer"
          >
            <option value="all">All Disciplines & Divisions</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-2">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card/80 px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Review">Review</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" ? (
        <>
          {/* Mobile Responsive Cards (Visible on mobile screens) */}
          <div className="block md:hidden space-y-3">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <div
                  key={emp._id}
                  className="rounded-xl border border-border/80 bg-card/80 p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {emp.image ? (
                        <img
                          src={emp.image}
                          alt={emp.name}
                          className="size-10 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-secondary font-bold text-xs text-foreground">
                          {emp.firstName?.[0] || emp.name?.[0] || "E"}
                        </div>
                      )}
                      <div>
                        <h4
                          onClick={() => onViewEmployee(emp)}
                          className="font-bold text-sm text-foreground hover:text-primary cursor-pointer"
                        >
                          {emp.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{emp.roleTitle}</p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${
                        emp.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px] font-mono">
                    <div>
                      <span className="text-muted-foreground uppercase text-[9px]">Station: </span>
                      <span className="text-foreground truncate block">{emp.shopName?.replace("ESARTHI ", "") || "Hub"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[9px]">ID: </span>
                      <span className="text-primary font-bold">{emp.employeeId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[9px]">Bay: </span>
                      <span className="text-foreground truncate block">{emp.assignedBay || "Bays 01-04"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[9px]">Dept: </span>
                      <span className="text-foreground truncate block">{emp.department}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                    <button
                      onClick={() => onViewEmployee(emp)}
                      className="flex-1 rounded-lg bg-primary/10 border border-primary/20 py-1.5 text-center text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer tap-active"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onEditEmployee(emp)}
                      className="rounded-lg p-2 bg-secondary/50 text-muted-foreground hover:text-foreground cursor-pointer tap-active"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteEmployee(emp._id)}
                      className="rounded-lg p-2 bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer tap-active"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-border bg-card/40 p-8 text-center text-xs text-muted-foreground">
                No technicians found matching criteria.
              </div>
            )}
          </div>

          {/* Desktop Full Data Table (Hidden on mobile screens) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-secondary/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3.5">Technician / Specialist</th>
                    <th className="px-5 py-3.5">Assigned Charging Hub</th>
                    <th className="px-5 py-3.5">Specialization & Level</th>
                    <th className="px-5 py-3.5">Bay & Shift</th>
                    <th className="px-5 py-3.5">Certifications</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp._id} className="transition-colors hover:bg-card/90">
                      {/* Name & Photo */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {emp.image ? (
                            <img
                              src={emp.image}
                              alt={emp.name}
                              className="size-9.5 shrink-0 rounded-full object-cover ring-1 ring-primary/40 shadow-sm"
                            />
                          ) : (
                            <div className="flex size-9.5 shrink-0 items-center justify-center rounded-full bg-accent font-display text-xs font-bold text-foreground ring-1 ring-primary/30">
                              {emp.firstName?.[0] || emp.name?.[0] || "T"}
                              {emp.lastName?.[0] || ""}
                            </div>
                          )}
                          <div>
                            <div
                              onClick={() => onViewEmployee(emp)}
                              className="cursor-pointer font-bold text-foreground hover:text-primary transition-colors"
                            >
                              {emp.name}
                            </div>
                            <div className="font-mono text-[10px] text-muted-foreground">
                              {emp.employeeId} · {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Station */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Zap size={13} className="text-amber-400 shrink-0" />
                          <span className="font-medium text-foreground truncate max-w-[150px]" title={emp.shopName}>
                            {emp.shopName?.replace("ESARTHI ", "") || "National Fleet"}
                          </span>
                        </div>
                      </td>

                      {/* Role & Level */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground">{emp.roleTitle}</span>
                          <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">
                            {emp.level || "L1"}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">{emp.department}</span>
                      </td>

                      {/* Bay & Shift */}
                      <td className="px-5 py-3.5">
                        <div className="font-mono text-[11px] font-semibold text-foreground">
                          {emp.assignedBay || "Bays 01-04 (DC)"}
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {emp.shift ? emp.shift.split(" ")[0] : "Day Shift"}
                        </div>
                      </td>

                      {/* Certifications */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[170px]">
                          {(emp.certifications || ["HV Certified"]).slice(0, 2).map((cert, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold text-emerald-400 truncate max-w-[160px] inline-flex items-center gap-1"
                            >
                              <Zap size={9} className="fill-emerald-400 shrink-0" />
                              <span className="truncate">{cert}</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${
                            emp.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : emp.status === "Onboarding"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {emp.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewEmployee(emp)}
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                            title="Inspect Technician Profile"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => onEditEmployee(emp)}
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteEmployee(emp._id)}
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive cursor-pointer"
                            title="Delete Technician"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                      No technicians match the selected station or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
      ) : (
        /* Grid Card View */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card/75 p-5 shadow-sm transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
            >
              <div>
                <div className="flex items-start justify-between">
                  {emp.image ? (
                    <img
                      src={emp.image}
                      alt={emp.name}
                      className="size-13 rounded-2xl object-cover ring-2 ring-primary/40 shadow-sm"
                    />
                  ) : (
                    <div className="flex size-13 items-center justify-center rounded-2xl bg-accent font-display text-sm font-bold text-foreground ring-2 ring-primary/30">
                      {emp.firstName?.[0] || emp.name?.[0] || "T"}
                      {emp.lastName?.[0] || ""}
                    </div>
                  )}

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold ${
                        emp.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {emp.status}
                    </span>
                    <span className="rounded bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[9px] font-semibold text-primary flex items-center gap-1">
                      <Zap size={9} className="text-amber-400" />
                      {emp.shopName?.split("—")[1]?.trim() || emp.shopName?.split("-")[1]?.trim() || "Hub"}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5">
                  <h3
                    onClick={() => onViewEmployee(emp)}
                    className="cursor-pointer font-display text-base font-bold text-foreground transition-colors group-hover:text-primary"
                  >
                    {emp.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary">{emp.roleTitle}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {emp.department} · {emp.level} · {emp.employeeId}
                  </p>
                </div>

                {/* Bay & Shift Bar */}
                <div className="mt-3 rounded-xl border border-border/80 bg-background/50 p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-muted-foreground">Bay:</span>
                    <span className="font-mono font-semibold text-foreground">{emp.assignedBay || "Bays 01-04"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-muted-foreground">Shift:</span>
                    <span className="font-mono text-emerald-400">{emp.shift || "Morning (06-14h)"}</span>
                  </div>
                </div>

                {/* Certifications badges */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {(emp.certifications || ["HV Safety Level 3", "OCPP 2.0.1"]).slice(0, 2).map((cert, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-emerald-400 inline-flex items-center gap-1"
                    >
                      <Zap size={9} className="fill-emerald-400 shrink-0" />
                      <span>{cert}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                <button
                  onClick={() => onViewEmployee(emp)}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Inspect Profile →
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditEmployee(emp)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteEmployee(emp._id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
