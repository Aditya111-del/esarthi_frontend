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
  HeartHandshake,
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

  // Resolve store admin info if available
  const adminName = shop?.adminName || "Store Admin";
  const adminEmail = shop?.adminEmail || `${adminName.toLowerCase().replace(/\s+/g, ".")}@esarthi.internal`;
  const adminPhone = shop?.adminPhone || "+91 98100 00000";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden rise">
        {/* Simple Minimalist Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3.5">
            {employee.image ? (
              <img
                src={employee.image}
                alt={employee.name}
                className="size-12 rounded-xl object-cover border border-border"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-xl bg-secondary font-display text-base font-bold text-foreground">
                {employee.firstName?.[0] || employee.name?.[0] || "E"}
                {employee.lastName?.[0] || ""}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {employee.name}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[9.5px] font-semibold ${
                    employee.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {employee.roleTitle} · {employee.department}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body: Personal + Organization Details */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6 text-xs">
          {/* SECTION 1: Personal Details */}
          <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-2">
              <User size={15} className="text-primary" />
              <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-wider">
                Personal Details
              </h4>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Full Name</span>
                <p className="font-medium text-foreground mt-0.5">{employee.name}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Personal / Contact Email</span>
                <p className="font-medium text-foreground mt-0.5 truncate">{employee.email}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Phone Number</span>
                <p className="font-medium text-foreground mt-0.5">{employee.phone || "Not provided"}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Date of Birth</span>
                <p className="font-medium text-foreground mt-0.5 font-mono">{employee.dateOfBirth || "On file"}</p>
              </div>

              <div className="sm:col-span-2">
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Full Residential Address</span>
                <p className="font-medium text-foreground mt-0.5">{employee.address || "Address registered on file"}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Emergency Contact Name</span>
                <p className="font-medium text-foreground mt-0.5">{employee.emergencyName || "Not assigned"}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Emergency Contact Phone</span>
                <p className="font-medium text-foreground mt-0.5">{employee.emergencyPhone || "Not assigned"}</p>
              </div>
            </div>

            {employee.bio && (
              <div className="pt-2 border-t border-border/50">
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Background / Biography</span>
                <p className="text-muted-foreground mt-1 leading-relaxed">"{employee.bio}"</p>
              </div>
            )}
          </div>

          {/* SECTION 2: Organization Details */}
          <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-2">
              <Building size={15} className="text-primary" />
              <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-wider">
                Organization Details
              </h4>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Employee ID</span>
                <p className="font-mono font-bold text-primary mt-0.5">{employee.employeeId}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Current Role & Level</span>
                <p className="font-medium text-foreground mt-0.5">
                  {employee.roleTitle} ({employee.level || "L3"})
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Department / Division</span>
                <p className="font-medium text-foreground mt-0.5">{employee.department}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Monthly Salary</span>
                <p className="font-medium text-foreground mt-0.5">{employee.salary || "Standard Payroll"}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Store / Shop Working In</span>
                <p className="font-bold text-foreground mt-0.5">{employee.shopName || "Central Store"}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Joining Date</span>
                <p className="font-mono font-medium text-foreground mt-0.5">{employee.joiningDate || "—"}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Employment Agreement</span>
                <p className="font-medium text-foreground mt-0.5">{employee.employmentType || "Full-time Permanent"}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Work Shift</span>
                <p className="font-medium text-foreground mt-0.5">{employee.shift || "Standard General Shift"}</p>
              </div>
            </div>

            {/* Shop Manager / Admin Particulars */}
            <div className="mt-3 pt-3 border-t border-border/50 rounded-lg bg-secondary/30 p-3">
              <span className="font-mono text-[10px] font-bold text-primary uppercase">
                Shop Manager / Admin In-Charge
              </span>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-foreground">{adminName}</span>
                <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
                  <span>{adminEmail}</span>
                  <span>·</span>
                  <span>{adminPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-secondary/20">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(employee)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
          >
            <Edit2 size={13} />
            Edit Employee Record
          </button>
        </div>
      </div>
    </div>
  );
};
