import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  ChevronDown,
  Filter,
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

const statusConfig: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  Active:     { color: "oklch(0.720 0.158 155)", bg: "oklch(0.680 0.158 155 / 0.10)", border: "oklch(0.680 0.158 155 / 0.22)", dot: "oklch(0.680 0.158 155)" },
  Onboarding: { color: "oklch(0.780 0.160 80)",  bg: "oklch(0.800 0.160 80 / 0.10)",  border: "oklch(0.800 0.160 80 / 0.22)",  dot: "oklch(0.800 0.160 80)" },
  Review:     { color: "oklch(0.680 0.160 280)", bg: "oklch(0.680 0.160 280 / 0.10)", border: "oklch(0.680 0.160 280 / 0.22)", dot: "oklch(0.680 0.160 280)" },
  "On Leave": { color: "oklch(0.560 0.014 240)", bg: "oklch(0.220 0.012 240 / 0.40)", border: "oklch(0.240 0.012 240 / 0.50)", dot: "oklch(0.420 0.012 240)" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig["On Leave"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.3125rem",
      padding: "0.1875rem 0.5rem", borderRadius: "9999px",
      fontSize: "0.6875rem", fontWeight: 600,
      fontFamily: '"JetBrains Mono", monospace',
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "9999px", background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function Avatar({ emp, size = 36 }: { emp: Employee; size?: number }) {
  const initials = `${emp.firstName?.[0] || emp.name?.[0] || ""}${emp.lastName?.[0] || ""}`.toUpperCase();
  if (emp.image || (emp as any).profilePhoto) {
    return (
      <img
        src={(emp as any).profilePhoto || emp.image}
        alt={emp.name}
        style={{ width: size, height: size, borderRadius: "9999px", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "9999px", flexShrink: 0,
      background: "oklch(0.680 0.158 155 / 0.14)",
      border: "1px solid oklch(0.680 0.158 155 / 0.20)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: '"Outfit", sans-serif', fontSize: size * 0.33, fontWeight: 700,
      color: "oklch(0.720 0.158 155)",
    }}>
      {initials || "—"}
    </div>
  );
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

  const activeFilterCount = [
    selectedDepartment !== "all",
    selectedStatus !== "all",
    selectedShop !== "all",
  ].filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="rise">

      {/* ── Header ─────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p className="es-overline" style={{ marginBottom: "0.375rem" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "9999px", background: "oklch(0.680 0.158 155)", display: "inline-block" }} />
            Workforce Directory
          </p>
          <h2 style={{ fontFamily: '"Outfit", sans-serif', fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em", color: "oklch(0.970 0.004 240)", margin: 0, lineHeight: 1.1 }}>
            Employee Roster
          </h2>
          <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "oklch(0.500 0.012 240)" }}>
            {employees.length} personnel across {shops.length} locations
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* View toggle */}
          <div style={{
            display: "flex", alignItems: "center", gap: "2px", padding: "3px",
            background: "oklch(0.118 0.012 240)", border: "1px solid oklch(0.240 0.012 240 / 0.45)",
            borderRadius: "10px",
          }}>
            {(["table", "grid"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  width: "2rem", height: "1.875rem", display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "7px", border: "none", cursor: "pointer",
                  transition: "all 0.12s ease",
                  background: viewMode === mode ? "oklch(0.680 0.158 155 / 0.15)" : "transparent",
                  color: viewMode === mode ? "oklch(0.720 0.158 155)" : "oklch(0.420 0.012 240)",
                }}
                title={mode === "table" ? "Table view" : "Grid view"}
              >
                {mode === "table" ? <List size={14} /> : <LayoutGrid size={14} />}
              </button>
            ))}
          </div>

          {/* Add button */}
          <button onClick={onOpenAddModal} className="es-btn es-btn-primary tap-active">
            <UserPlus size={14} />
            <span className="hidden sm:inline">Add Employee</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div style={{ display: "grid", gap: "0.625rem", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {/* Search */}
        <div style={{ position: "relative", minWidth: "200px", flex: "2 1 200px" }}>
          <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "oklch(0.420 0.012 240)", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Search by name, ID, role…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="es-input"
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>

        <select value={selectedShop} onChange={(e) => onShopChange(e.target.value)} className="es-select">
          <option value="all">All Locations</option>
          {shops.map((s) => (
            <option key={s._id} value={s._id}>{s.city}: {s.name}</option>
          ))}
        </select>

        <select value={selectedDepartment} onChange={(e) => onDepartmentChange(e.target.value)} className="es-select">
          <option value="all">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)} className="es-select">
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Onboarding">Onboarding</option>
          <option value="Review">Review</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      {/* ── Content ────────────────────────────────────── */}
      {viewMode === "table" ? (
        <>
          {/* Mobile cards */}
          <div className="block md:hidden" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {employees.length > 0 ? employees.map((emp) => (
              <div
                key={emp._id}
                className="es-card"
                style={{ padding: "1rem", cursor: "pointer" }}
                onClick={() => onViewEmployee(emp)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                    <Avatar emp={emp} size={40} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "oklch(0.970 0.004 240)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "oklch(0.500 0.012 240)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.roleTitle}</p>
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>
                <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid oklch(0.220 0.012 240 / 0.35)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.375rem 1rem" }}>
                  <div>
                    <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", color: "oklch(0.380 0.010 240)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Shop</p>
                    <p style={{ fontSize: "0.75rem", color: "oklch(0.760 0.008 240)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.shopName || "—"}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", color: "oklch(0.380 0.010 240)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>ID</p>
                    <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.75rem", color: "oklch(0.680 0.158 155)", fontWeight: 600, margin: 0 }}>{emp.employeeId}</p>
                  </div>
                </div>
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onViewEmployee(emp)} className="es-btn es-btn-ghost" style={{ flex: 1, justifyContent: "center", height: "2rem", fontSize: "0.75rem" }}>
                    <Eye size={12} /> View
                  </button>
                  <button onClick={() => onEditEmployee(emp)} className="es-btn es-btn-ghost" style={{ height: "2rem", padding: "0 0.625rem" }}><Edit2 size={12} /></button>
                  <button onClick={() => onDeleteEmployee(emp._id)} className="es-btn es-btn-danger" style={{ height: "2rem", padding: "0 0.625rem" }}><Trash2 size={12} /></button>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "oklch(0.420 0.012 240)", fontSize: "0.8125rem" }}>
                No employees match your filters
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block es-card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="es-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Shop</th>
                    <th>Level</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Avatar emp={emp} size={34} />
                          <div>
                            <button
                              onClick={() => onViewEmployee(emp)}
                              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                            >
                              <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "oklch(0.970 0.004 240)", margin: 0, transition: "color 0.12s ease" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.720 0.158 155)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.970 0.004 240)")}
                              >{emp.name}</p>
                            </button>
                            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", color: "oklch(0.420 0.012 240)", margin: "1px 0 0" }}>{emp.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p style={{ fontSize: "0.8125rem", color: "oklch(0.760 0.008 240)", margin: 0 }}>{emp.department}</p>
                        <p style={{ fontSize: "0.6875rem", color: "oklch(0.420 0.012 240)", margin: "2px 0 0" }}>{emp.roleTitle}</p>
                      </td>
                      <td>
                        <p style={{ fontSize: "0.8125rem", color: "oklch(0.760 0.008 240)", margin: 0, maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.shopName || "—"}</p>
                      </td>
                      <td>
                        <span style={{
                          fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", fontWeight: 700,
                          padding: "2px 7px", borderRadius: "5px",
                          background: "oklch(0.680 0.158 155 / 0.10)", color: "oklch(0.680 0.158 155)",
                          border: "1px solid oklch(0.680 0.158 155 / 0.18)",
                        }}>
                          {emp.level || "L1"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", color: "oklch(0.500 0.012 240)" }}>
                          {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
                        </span>
                      </td>
                      <td><StatusBadge status={emp.status} /></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                          {[
                            { icon: <Eye size={13} />, onClick: () => onViewEmployee(emp), title: "View", danger: false },
                            { icon: <Edit2 size={13} />, onClick: () => onEditEmployee(emp), title: "Edit", danger: false },
                            { icon: <Trash2 size={13} />, onClick: () => onDeleteEmployee(emp._id), title: "Delete", danger: true },
                          ].map((action, i) => (
                            <button
                              key={i}
                              onClick={action.onClick}
                              title={action.title}
                              style={{
                                width: "1.875rem", height: "1.875rem", display: "flex", alignItems: "center", justifyContent: "center",
                                borderRadius: "7px", border: "1px solid transparent",
                                background: "transparent", cursor: "pointer",
                                color: action.danger ? "oklch(0.680 0.200 27)" : "oklch(0.420 0.012 240)",
                                transition: "all 0.12s ease",
                              }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                if (action.danger) {
                                  el.style.background = "oklch(0.580 0.230 27 / 0.10)";
                                  el.style.borderColor = "oklch(0.580 0.230 27 / 0.25)";
                                } else {
                                  el.style.background = "oklch(0.155 0.012 240)";
                                  el.style.borderColor = "oklch(0.240 0.012 240 / 0.50)";
                                  el.style.color = "oklch(0.970 0.004 240)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.background = "transparent";
                                el.style.borderColor = "transparent";
                                el.style.color = action.danger ? "oklch(0.680 0.200 27)" : "oklch(0.420 0.012 240)";
                              }}
                            >
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "oklch(0.420 0.012 240)", fontSize: "0.8125rem" }}>
                        No employees match your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ── Grid view ─────────────────────────────────── */
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="es-card es-card-hover"
              style={{ padding: "1.25rem", cursor: "pointer", transition: "all 0.20s ease" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                <Avatar emp={emp} size={44} />
                <StatusBadge status={emp.status} />
              </div>

              <div style={{ marginTop: "0.875rem" }}>
                <h3
                  onClick={() => onViewEmployee(emp)}
                  style={{ fontFamily: '"Outfit", sans-serif', fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "-0.02em", color: "oklch(0.970 0.004 240)", margin: "0 0 2px", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.720 0.158 155)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.970 0.004 240)")}
                >
                  {emp.name}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "oklch(0.680 0.158 155)", margin: 0, fontWeight: 600 }}>{emp.roleTitle}</p>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", color: "oklch(0.420 0.012 240)", margin: "4px 0 0" }}>
                  {emp.employeeId} · {emp.level || "L1"}
                </p>
              </div>

              <div style={{ marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <p style={{ fontSize: "0.75rem", color: "oklch(0.500 0.012 240)", margin: 0 }}>{emp.department}</p>
                <p style={{ fontSize: "0.75rem", color: "oklch(0.500 0.012 240)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.shopName || "—"}</p>
              </div>

              <div style={{ marginTop: "0.875rem", display: "flex", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onViewEmployee(emp)} className="es-btn es-btn-ghost" style={{ flex: 1, justifyContent: "center", height: "2rem", fontSize: "0.75rem" }}>
                  <Eye size={12} /> View
                </button>
                <button onClick={() => onEditEmployee(emp)} className="es-btn es-btn-ghost" style={{ height: "2rem", padding: "0 0.625rem" }}><Edit2 size={12} /></button>
                <button onClick={() => onDeleteEmployee(emp._id)} className="es-btn es-btn-danger" style={{ height: "2rem", padding: "0 0.625rem" }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {employees.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "oklch(0.420 0.012 240)", fontSize: "0.8125rem" }}>
              No employees match your filters
            </div>
          )}
        </div>
      )}
    </div>
  );
};
