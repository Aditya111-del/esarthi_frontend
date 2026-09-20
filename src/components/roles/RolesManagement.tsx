import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
} from "lucide-react";
import { JobRole } from "../../types";

interface RolesManagementProps {
  roles: JobRole[];
  onOpenCreateRole: () => void;
  onEditRole: (role: JobRole) => void;
  onDeleteRole: (id: string) => void;
  departments: string[];
}

export const RolesManagement: React.FC<RolesManagementProps> = ({
  roles,
  onOpenCreateRole,
  onEditRole,
  onDeleteRole,
  departments,
}) => {
  const [selectedDept, setSelectedDept] = useState("all");
  const [search, setSearch] = useState("");

  const filteredRoles = roles.filter((r) => {
    const matchesDept = selectedDept === "all" || r.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="fade-in">
      {/* Header */}
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
              Job Roles & Competency Standards
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
              {roles.length} Roles
            </span>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "oklch(0.500 0.012 240)", margin: "4px 0 0" }}>
            High-voltage engineering certifications, seniority bands, and operational responsibilities
          </p>
        </div>

        <button
          onClick={onOpenCreateRole}
          className="es-btn es-btn-primary"
          style={{ height: "2.25rem", padding: "0 1rem", fontSize: "0.8125rem" }}
        >
          <Plus size={14} />
          Create New Role
        </button>
      </div>

      {/* Filters & Department Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <div className="es-search-wrap" style={{ width: "260px" }}>
          <Search size={14} className="es-search-icon" />
          <input
            type="text"
            placeholder="Search roles or competencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="es-input"
            style={{ height: "2.125rem", fontSize: "0.75rem" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", overflowX: "auto", maxWidth: "100%", paddingBottom: "2px" }}>
          <button
            onClick={() => setSelectedDept("all")}
            className="es-btn"
            style={{
              height: "2rem",
              padding: "0 0.75rem",
              fontSize: "0.75rem",
              borderRadius: "8px",
              ...(selectedDept === "all"
                ? { background: "oklch(0.680 0.158 155)", color: "white", fontWeight: 600 }
                : { background: "oklch(0.120 0.012 240)", color: "oklch(0.500 0.012 240)" }),
            }}
          >
            All Verticals
          </button>
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDept(d)}
              className="es-btn"
              style={{
                height: "2rem",
                padding: "0 0.75rem",
                fontSize: "0.75rem",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                ...(selectedDept === d
                  ? { background: "oklch(0.680 0.158 155)", color: "white", fontWeight: 600 }
                  : { background: "oklch(0.120 0.012 240)", color: "oklch(0.500 0.012 240)" }),
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Roles Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredRoles.map((role) => (
          <div
            key={role._id}
            className="es-card es-card-hover"
            style={{
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "10px",
                    background: "oklch(0.680 0.158 155 / 0.12)",
                    color: "oklch(0.760 0.150 155)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Briefcase size={16} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      background: "oklch(0.155 0.012 240)",
                      color: "oklch(0.760 0.150 155)",
                      border: "1px solid oklch(0.680 0.158 155 / 0.20)",
                      borderRadius: "6px",
                      padding: "2px 6px",
                    }}
                  >
                    {role.level}
                  </span>

                  <button
                    onClick={() => onEditRole(role)}
                    className="es-btn es-btn-ghost"
                    style={{ width: "1.75rem", height: "1.75rem", padding: 0 }}
                    title="Edit Role"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onDeleteRole(role._id)}
                    className="es-btn es-btn-danger"
                    style={{ width: "1.75rem", height: "1.75rem", padding: 0 }}
                    title="Delete Role"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
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
                  {role.title}
                </h3>
                <p
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.6875rem",
                    color: "oklch(0.480 0.012 240)",
                    textTransform: "uppercase",
                    margin: "2px 0 0",
                  }}
                >
                  {role.department}
                </p>
              </div>

              <p
                style={{
                  fontSize: "0.75rem",
                  lineHeight: 1.5,
                  color: "oklch(0.600 0.012 240)",
                  marginTop: "0.75rem",
                }}
              >
                {role.description}
              </p>

              {role.responsibilities && role.responsibilities.length > 0 && (
                <div
                  style={{
                    marginTop: "0.875rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.375rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.625rem",
                      color: "oklch(0.420 0.012 240)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Key Responsibilities
                  </span>
                  {role.responsibilities.slice(0, 2).map((resp, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "oklch(0.800 0.005 240)" }}>
                      <CheckCircle2 size={12} style={{ color: "oklch(0.680 0.158 155)", flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {role.skills && role.skills.length > 0 && (
              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.375rem",
                }}
              >
                {role.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.625rem",
                      background: "oklch(0.155 0.012 240)",
                      color: "oklch(0.700 0.010 240)",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      border: "1px solid oklch(0.220 0.012 240 / 0.40)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {filteredRoles.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "4rem 1rem",
              color: "oklch(0.420 0.012 240)",
              fontSize: "0.8125rem",
            }}
          >
            No job roles found matching your filter
          </div>
        )}
      </div>
    </div>
  );
};
