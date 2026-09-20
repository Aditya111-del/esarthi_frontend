import React from "react";
import {
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Edit2,
  CheckCircle2,
  Building,
  User,
  Shield,
  FileText,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Employee, Shop } from "../../types";

interface EmployeeDetailDrawerProps {
  employee: Employee | null;
  shop?: Shop | null;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
}

export const EmployeeDetailDrawer: React.FC<EmployeeDetailDrawerProps> = ({
  employee,
  shop,
  onClose,
  onEdit,
}) => {
  if (!employee) return null;

  const adminName = shop?.adminName || "Store Admin";
  const adminEmail = shop?.adminEmail || `${adminName.toLowerCase().replace(/\s+/g, ".")}@esarthi.com`;
  const adminPhone = shop?.adminPhone || "+91 98100 00000";

  return (
    <div className="es-modal-overlay" onClick={onClose}>
      <div
        className="es-modal"
        style={{ maxWidth: "42rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="es-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            {employee.image || employee.profilePhoto ? (
              <img
                src={employee.image || employee.profilePhoto}
                alt={employee.name}
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: "1px solid oklch(0.240 0.012 240 / 0.60)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "12px",
                  background: "oklch(0.155 0.012 240)",
                  border: "1px solid oklch(0.240 0.012 240 / 0.60)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "oklch(0.760 0.150 155)",
                }}
              >
                {employee.firstName?.[0] || employee.name?.[0] || "E"}
                {employee.lastName?.[0] || ""}
              </div>
            )}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h2
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "oklch(0.980 0.005 240)",
                    margin: 0,
                  }}
                >
                  {employee.name}
                </h2>
                <span
                  className={`es-badge ${
                    employee.status === "Active" ? "es-badge-emerald" : "es-badge-amber"
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "oklch(0.500 0.012 240)", margin: "2px 0 0" }}>
                {employee.roleTitle} · {employee.department} · {employee.employeeId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="es-btn es-btn-ghost"
            style={{ width: "2rem", height: "2rem", padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="es-modal-body" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Section 1: Employment & Station Assignment */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              background: "oklch(0.098 0.010 240)",
              border: "1px solid oklch(0.220 0.012 240 / 0.40)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <Briefcase size={13} style={{ color: "oklch(0.680 0.158 155)" }} />
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "oklch(0.650 0.012 240)",
                }}
              >
                Organization & Deployment
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Employee ID</span>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.8125rem", fontWeight: 700, color: "oklch(0.760 0.150 155)", margin: "2px 0 0" }}>
                  {employee.employeeId}
                </p>
              </div>

              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Role & Level</span>
                <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "oklch(0.900 0.005 240)", margin: "2px 0 0" }}>
                  {employee.roleTitle} ({employee.level || "L3"})
                </p>
              </div>

              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Monthly Compensation</span>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "oklch(0.900 0.005 240)", margin: "2px 0 0" }}>
                  {employee.salary || "₹1,20,000 / mo"}
                </p>
              </div>

              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Joining Date</span>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.8125rem", color: "oklch(0.800 0.005 240)", margin: "2px 0 0" }}>
                  {employee.joiningDate || "2024-01-15"}
                </p>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Station Assignment & Shift</span>
                <p style={{ fontSize: "0.8125rem", color: "oklch(0.900 0.005 240)", margin: "2px 0 0" }}>
                  {employee.shopName || shop?.name || "All Stations"} · {employee.assignedBay || "Bays 01-04 (DC Fast Chargers)"} · {employee.shift || "Morning Shift"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Contact Information */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              background: "oklch(0.098 0.010 240)",
              border: "1px solid oklch(0.220 0.012 240 / 0.40)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <User size={13} style={{ color: "oklch(0.680 0.158 155)" }} />
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "oklch(0.650 0.012 240)",
                }}
              >
                Personal Details
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Email Address</span>
                <p style={{ fontSize: "0.8125rem", color: "oklch(0.850 0.005 240)", margin: "2px 0 0", wordBreak: "break-all" }}>
                  {employee.email}
                </p>
              </div>

              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Phone Number</span>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.8125rem", color: "oklch(0.850 0.005 240)", margin: "2px 0 0" }}>
                  {employee.phone || "Not provided"}
                </p>
              </div>

              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Date of Birth</span>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.8125rem", color: "oklch(0.850 0.005 240)", margin: "2px 0 0" }}>
                  {employee.dateOfBirth || "On file"}
                </p>
              </div>

              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Emergency Contact</span>
                <p style={{ fontSize: "0.8125rem", color: "oklch(0.850 0.005 240)", margin: "2px 0 0" }}>
                  {employee.emergencyName ? `${employee.emergencyName} (${employee.emergencyPhone || "—"})` : "Not assigned"}
                </p>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Residential Address</span>
                <p style={{ fontSize: "0.8125rem", color: "oklch(0.800 0.005 240)", margin: "2px 0 0" }}>
                  {employee.address || "Registered company file address"}
                </p>
              </div>
            </div>

            {employee.bio && (
              <div style={{ marginTop: "0.25rem", paddingTop: "0.5rem", borderTop: "1px solid oklch(0.220 0.012 240 / 0.30)" }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>Biography / Background</span>
                <p style={{ fontSize: "0.8125rem", color: "oklch(0.600 0.012 240)", margin: "2px 0 0", fontStyle: "italic" }}>
                  "{employee.bio}"
                </p>
              </div>
            )}
          </div>

          {/* Section 3: High-Voltage Clearance & Certifications */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              background: "oklch(0.680 0.158 155 / 0.06)",
              border: "1px solid oklch(0.680 0.158 155 / 0.20)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <Shield size={13} style={{ color: "oklch(0.680 0.158 155)" }} />
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "oklch(0.760 0.150 155)",
                }}
              >
                Technical Clearance & Safety Certification
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
              <CheckCircle2 size={14} style={{ color: "oklch(0.760 0.150 155)" }} />
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "oklch(0.950 0.005 240)" }}>
                {employee.safetyEquipmentCleared ? "High-Voltage PPE & Arc Flash Clearance Approved" : "Pending Arc Flash Training"}
              </span>
            </div>

            <div style={{ marginTop: "0.25rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "oklch(0.700 0.012 240)", margin: 0 }}>
                {Array.isArray(employee.certifications)
                  ? employee.certifications.join(" · ")
                  : employee.certifications || "High-Voltage Safety Certified (Level 4), OCPP 2.0.1 Protocol"}
              </p>
            </div>
          </div>

          {/* Section 4: Verified Identity Documents (Aadhaar, PAN Card, Photo) */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              background: "oklch(0.098 0.010 240)",
              border: "1px solid oklch(0.220 0.012 240 / 0.40)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <FileText size={13} style={{ color: "oklch(0.680 0.158 155)" }} />
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "oklch(0.650 0.012 240)",
                }}
              >
                Verified Identity Documents (Cloudinary Secure Storage)
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
              {/* Aadhaar Card */}
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  background: "oklch(0.120 0.012 240)",
                  border: "1px solid oklch(0.220 0.012 240 / 0.50)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>
                    Aadhaar Card (UIDAI)
                  </span>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: employee.aadhaarCardUrl ? "oklch(0.760 0.150 155)" : "oklch(0.480 0.012 240)", margin: "2px 0 0" }}>
                    {employee.aadhaarCardUrl ? "Verified on File" : "Not yet uploaded"}
                  </p>
                </div>

                {employee.aadhaarCardUrl && (
                  <a
                    href={employee.aadhaarCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="es-btn es-btn-ghost"
                    style={{ height: "1.75rem", fontSize: "0.6875rem", justifyContent: "center" }}
                  >
                    <ExternalLink size={11} /> Open Document
                  </a>
                )}
              </div>

              {/* PAN Card */}
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  background: "oklch(0.120 0.012 240)",
                  border: "1px solid oklch(0.220 0.012 240 / 0.50)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", textTransform: "uppercase" }}>
                    PAN Card (Income Tax)
                  </span>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: employee.panCardUrl ? "oklch(0.760 0.150 155)" : "oklch(0.480 0.012 240)", margin: "2px 0 0" }}>
                    {employee.panCardUrl ? "Verified on File" : "Not yet uploaded"}
                  </p>
                </div>

                {employee.panCardUrl && (
                  <a
                    href={employee.panCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="es-btn es-btn-ghost"
                    style={{ height: "1.75rem", fontSize: "0.6875rem", justifyContent: "center" }}
                  >
                    <ExternalLink size={11} /> Open Document
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="es-modal-footer">
          <button onClick={onClose} className="es-btn es-btn-ghost" style={{ height: "2.25rem", fontSize: "0.8125rem" }}>
            Close Dossier
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
            className="es-btn es-btn-primary"
            style={{ height: "2.25rem", fontSize: "0.8125rem" }}
          >
            <Edit2 size={13} /> Edit Record
          </button>
        </div>
      </div>
    </div>
  );
};
