import React, { useState, useEffect, FormEvent } from "react";
import { X, UserPlus, Save, Store, DollarSign } from "lucide-react";
import { Employee, JobRole, Shop } from "../../types";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Partial<Employee>) => Promise<void>;
  initialData?: Employee | null;
  roles: JobRole[];
  departments: string[];
  shops: Shop[];
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  roles,
  departments,
  shops,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [shopId, setShopId] = useState("");
  const [shopName, setShopName] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [roleTitle, setRoleTitle] = useState("");
  const [roleId, setRoleId] = useState("");
  const [level, setLevel] = useState("L3");
  const [status, setStatus] = useState<"Active" | "Onboarding" | "Review" | "On Leave">("Active");
  const [employmentType, setEmploymentType] = useState<"Full-time" | "Part-time" | "Contract" | "Intern">("Full-time");
  const [salary, setSalary] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [assignedBay, setAssignedBay] = useState("Bays 01-04 (DC Fast)");
  const [shift, setShift] = useState("Morning Shift (06:00 - 14:00)");
  const [certifications, setCertifications] = useState("High-Voltage Safety Certified (Level 4), OCPP 2.0.1 Protocol");
  const [safetyEquipmentCleared, setSafetyEquipmentCleared] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || initialData.name?.split(" ")[0] || "");
      setLastName(initialData.lastName || initialData.name?.split(" ").slice(1).join(" ") || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setEmployeeId(initialData.employeeId || `ES-EMP-${Math.floor(1000 + Math.random() * 9000)}`);
      setShopId(initialData.shopId || shops[0]?._id || "");
      setShopName(initialData.shopName || shops[0]?.name || "Central Headquarters");
      setDepartment(initialData.department || "Field Engineering & HV Diagnostics");
      setRoleTitle(initialData.roleTitle || roles[0]?.title || "High-Voltage Field Engineer");
      setRoleId(initialData.roleId || roles[0]?._id || "");
      setLevel(initialData.level || "L3");
      setStatus(initialData.status || "Active");
      setEmploymentType(initialData.employmentType || "Full-time");
      setSalary(initialData.salary || "₹1,20,000 / mo");
      setJoiningDate(initialData.joiningDate || new Date().toISOString().split("T")[0]);
      setDateOfBirth(initialData.dateOfBirth || "");
      setAddress(initialData.address || "");
      setEmergencyName(initialData.emergencyName || "");
      setEmergencyPhone(initialData.emergencyPhone || "");
      setSkills(Array.isArray(initialData.skills) ? initialData.skills.join(", ") : "");
      setBio(initialData.bio || "");
      setAssignedBay(initialData.assignedBay || "Bays 01-04 (DC Fast)");
      setShift(initialData.shift || "Morning Shift (06:00 - 14:00)");
      setCertifications(
        Array.isArray(initialData.certifications)
          ? initialData.certifications.join(", ")
          : "High-Voltage Safety Certified (Level 4), OCPP 2.0.1 Protocol"
      );
      setSafetyEquipmentCleared(initialData.safetyEquipmentCleared ?? true);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setEmployeeId(`EV-TECH-${Math.floor(1000 + Math.random() * 9000)}`);
      setShopId(shops[0]?._id || "");
      setShopName(shops[0]?.name || "Central Headquarters");
      setDepartment("Field Engineering & HV Diagnostics");
      setRoleTitle(roles[0]?.title || "High-Voltage Field Engineer");
      setRoleId(roles[0]?._id || "");
      setLevel("L3");
      setStatus("Active");
      setEmploymentType("Full-time");
      setSalary("₹1,20,000 / mo");
      setJoiningDate(new Date().toISOString().split("T")[0]);
      setDateOfBirth("");
      setAddress("");
      setEmergencyName("");
      setEmergencyPhone("");
      setSkills("High-Voltage Safety, CCS-2 Diagnostics, Multimeter, LOTO");
      setBio("");
      setAssignedBay("Bays 01-04 (DC Fast)");
      setShift("Morning Shift (06:00 - 14:00)");
      setCertifications("High-Voltage Safety Certified (Level 4), OCPP 2.0.1 Protocol");
      setSafetyEquipmentCleared(true);
    }
    setError("");
  }, [initialData, isOpen, roles, shops]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last names are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const resolvedShop = shops.find((s) => s._id === shopId) || shops[0];
      await onSave({
        _id: initialData?._id,
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, "")}@esarthi.internal`,
        phone: phone.trim(),
        employeeId: employeeId.trim() || `ES-${Math.floor(1000 + Math.random() * 9000)}`,
        shopId: resolvedShop ? resolvedShop._id : shopId,
        shopName: resolvedShop ? resolvedShop.name : shopName,
        department,
        roleTitle: roleTitle || "Staff Member",
        roleId,
        level,
        status,
        employmentType,
        salary: salary.trim(),
        joiningDate: joiningDate || new Date().toISOString().split("T")[0],
        dateOfBirth,
        address,
        emergencyName,
        emergencyPhone,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        assignedBay,
        shift,
        certifications: certifications.split(",").map((c) => c.trim()).filter(Boolean),
        safetyEquipmentCleared,
        bio,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save employee details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2.5 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-auto w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl luxury-card shadow-2xl overflow-hidden border border-white/[0.1]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 sm:px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
              <UserPlus size={16} />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                {initialData ? "Edit Employee Profile" : "Register Employee (Complete Data)"}
              </h3>
              <p className="font-mono text-[9.5px] sm:text-[10px] text-muted-foreground">
                ESARTHI Workforce & Shop Directory Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground cursor-pointer tap-active transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in">
              {error}
            </div>
          )}

          {/* Shop Assignment */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Store size={14} /> Assigned Shop / Branch *
            </label>
            <select
              value={shopId}
              onChange={(e) => {
                setShopId(e.target.value);
                const s = shops.find((item) => item._id === e.target.value);
                if (s) setShopName(s.name);
              }}
              className="mt-1 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground focus:outline-none font-medium bg-black/60"
            >
              {shops.map((s) => (
                <option key={s._id} value={s._id} className="bg-neutral-900 text-white">
                  {s.name} ({s.city}) — {s.code}
                </option>
              ))}
            </select>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Personal Identification
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-foreground">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 font-medium transition-all outline-none"
                  placeholder="e.g. Aryan"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 font-medium transition-all outline-none"
                  placeholder="e.g. Verma"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 font-medium transition-all outline-none font-mono"
                  placeholder="name@esarthi.internal"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 font-medium transition-all outline-none font-mono"
                  placeholder="+91 98765 00000"
                />
              </div>
            </div>
          </div>

          {/* Employment & Compensation */}
          <div className="space-y-4 border-t border-white/[0.08] pt-5">
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Employment & Role Details
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-foreground">Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 font-mono text-xs text-foreground transition-all outline-none"
                  placeholder="ES-1024"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground transition-all outline-none bg-black/60"
                >
                  {departments.map((d) => (
                    <option key={d} value={d} className="bg-neutral-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground transition-all outline-none bg-black/60"
                >
                  <option value="Active" className="bg-neutral-900 text-white">Active</option>
                  <option value="Onboarding" className="bg-neutral-900 text-white">Onboarding</option>
                  <option value="Review" className="bg-neutral-900 text-white">Review</option>
                  <option value="On Leave" className="bg-neutral-900 text-white">On Leave</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Job Role Designation</label>
                <input
                  type="text"
                  list="roles-list"
                  value={roleTitle}
                  onChange={(e) => {
                    setRoleTitle(e.target.value);
                    const matched = roles.find((r) => r.title.toLowerCase() === e.target.value.toLowerCase());
                    if (matched) {
                      setRoleId(matched._id);
                      setLevel(matched.level);
                    }
                  }}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 transition-all outline-none"
                  placeholder="e.g. Lead Backend Engineer"
                />
                <datalist id="roles-list">
                  {roles.map((r) => (
                    <option key={r._id} value={r.title} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Seniority Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground transition-all outline-none bg-black/60"
                >
                  <option value="L1" className="bg-neutral-900 text-white">L1 — Associate</option>
                  <option value="L2" className="bg-neutral-900 text-white">L2 — Mid-Level</option>
                  <option value="L3" className="bg-neutral-900 text-white">L3 — Senior</option>
                  <option value="L4" className="bg-neutral-900 text-white">L4 — Staff / Lead</option>
                  <option value="L5" className="bg-neutral-900 text-white">L5 — Principal / Director</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Employment Agreement</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground transition-all outline-none bg-black/60"
                >
                  <option value="Full-time" className="bg-neutral-900 text-white">Full-time</option>
                  <option value="Part-time" className="bg-neutral-900 text-white">Part-time</option>
                  <option value="Contract" className="bg-neutral-900 text-white">Contract</option>
                  <option value="Intern" className="bg-neutral-900 text-white">Intern</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Salary / Monthly CTC</label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 transition-all outline-none font-mono"
                  placeholder="₹85,000 / mo"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Joining Date</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground transition-all outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground transition-all outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 transition-all outline-none"
                  placeholder="Apartment, Street, City, State"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts & Skills */}
          <div className="space-y-4 border-t border-white/[0.08] pt-5">
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Emergency & Qualifications
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-foreground">Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 transition-all outline-none"
                  placeholder="Kin / Guardian Name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 transition-all outline-none font-mono"
                  placeholder="+91 98765 00000"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl luxury-input px-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 transition-all outline-none"
                  placeholder="High-Voltage Safety, CCS-2 Diagnostics, Multimeter"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Professional Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1.5 w-full rounded-xl luxury-input p-3 text-xs text-foreground placeholder:text-muted-foreground/40 transition-all outline-none resize-none"
                  placeholder="Summary of experience..."
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 border-t border-white/[0.08] pt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer tap-active text-center transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl luxury-button px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md disabled:opacity-50 cursor-pointer tap-active"
            >
              <Save size={14} />
              {isSubmitting ? "Saving..." : initialData ? "Update Employee" : "Register Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
