import React, { useState, useEffect } from "react";
import {
  Briefcase,
  ChevronRight,
  Check,
  UserPlus,
  ShieldCheck,
  Zap,
  DollarSign,
  Phone,
  User,
  MapPin,
  Calendar,
  Sparkles,
  Clock,
  Award,
  CheckCircle2,
} from "lucide-react";
import { JobRole, Employee, Shop, UserSession } from "../../types";

interface QuickOnboardingFormProps {
  roles: JobRole[];
  shops: Shop[];
  currentUser: UserSession;
  onComplete: (emp: Partial<Employee>) => Promise<void>;
  onCancel: () => void;
}

export const QuickOnboardingForm: React.FC<QuickOnboardingFormProps> = ({
  roles,
  shops,
  currentUser,
  onComplete,
  onCancel,
}) => {
  const isShopAdmin = currentUser.type === "shopadmin";

  const defaultShop = isShopAdmin
    ? shops.find((s) => s._id === currentUser.assignedShopId) || shops[0]
    : shops[0];

  const [step, setStep] = useState(1);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(defaultShop || null);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(roles[0] || null);

  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeId, setEmployeeId] = useState(`EV-TECH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  // Employment & Compensation
  const [employmentType, setEmploymentType] = useState<"Full-time" | "Part-time" | "Contract" | "Intern">("Full-time");
  const [salary, setSalary] = useState("₹1,20,000 / mo");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split("T")[0]);

  // EV Station Assignment & Safety Gear
  const [assignedBay, setAssignedBay] = useState("Bays 01-04 (DC Fast)");
  const [shift, setShift] = useState("Morning Shift (06:00 - 14:00)");
  const [certifications, setCertifications] = useState("High-Voltage Safety Certified (Level 4), OCPP 2.0.1 Protocol, Arc Flash NFPA 70E");
  const [safetyEquipmentCleared, setSafetyEquipmentCleared] = useState(true);

  // Emergency & Professional
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isShopAdmin && currentUser.assignedShopId) {
      const match = shops.find((s) => s._id === currentUser.assignedShopId);
      if (match) setSelectedShop(match);
    }
  }, [currentUser, shops, isShopAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last names are mandatory");
      return;
    }

    if (!selectedShop) {
      setError("Please select an operating charging station");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onComplete({
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email:
          email.trim() ||
          `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, "")}@esarthi-ev.internal`,
        phone: phone.trim(),
        employeeId: employeeId.trim(),
        shopId: selectedShop._id,
        shopName: selectedShop.name,
        department: selectedRole?.department || "Field Engineering & HV Diagnostics",
        roleTitle: selectedRole?.title || "High-Voltage Field Engineer",
        roleId: selectedRole?._id || "",
        level: selectedRole?.level || "L3",
        status: "Active",
        employmentType,
        salary: salary.trim(),
        joiningDate: joiningDate || new Date().toISOString().split("T")[0],
        dateOfBirth,
        address,
        assignedBay,
        shift,
        certifications: certifications.split(",").map((c) => c.trim()).filter(Boolean),
        safetyEquipmentCleared,
        emergencyName,
        emergencyPhone,
        skills: skills
          ? skills.split(",").map((s) => s.trim()).filter(Boolean)
          : selectedRole?.skills || ["High-Voltage Safety", "CCS-2 Diagnostics"],
        bio,
      });
    } catch (err: any) {
      setError(err.message || "Failed to finalize technician onboarding");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 rise">
      {/* Wizard Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-primary uppercase font-bold">
            <Zap size={12} className="text-amber-400" />
            {isShopAdmin
              ? `STATION ADMIN ONBOARDING · ${currentUser.assignedShopName || "ASSIGNED CHARGING HUB"}`
              : "SUPERADMIN WORKSPACE · EV TECHNICIAN ONBOARDING ENGINE"}
          </div>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Onboard EV Field Engineer & Staff
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Step {step} of 3 ·{" "}
            {step === 1
              ? "Station & Role Specification"
              : step === 2
              ? "Personal & Contact Particulars"
              : "EV Certifications, Bay Assignment & Safety"}
          </p>
        </div>

        {/* Progress Navigation Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] ${
              step === 1
                ? "bg-primary text-primary-foreground font-bold"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <span>1</span>
            <span className="hidden sm:inline">Station & Role</span>
          </div>
          <ChevronRight size={13} className="text-muted-foreground" />
          <div
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] ${
              step === 2
                ? "bg-primary text-primary-foreground font-bold"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <span>2</span>
            <span className="hidden sm:inline">Personal Data</span>
          </div>
          <ChevronRight size={13} className="text-muted-foreground" />
          <div
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] ${
              step === 3
                ? "bg-primary text-primary-foreground font-bold"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <span>3</span>
            <span className="hidden sm:inline">HV Certs & Safety</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* STEP 1: Station Hub & Role Selection */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Station Selection Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" /> 1. Select Operating Charging Hub *
              </label>
              {isShopAdmin && (
                <span className="rounded bg-accent px-2 py-0.5 font-mono text-[10px] text-primary">
                  Locked to your assigned station
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {shops.map((shop) => {
                const isSelected = selectedShop?._id === shop._id;
                const isDisabled = isShopAdmin && currentUser.assignedShopId !== shop._id;

                return (
                  <div
                    key={shop._id}
                    onClick={() => !isDisabled && setSelectedShop(shop)}
                    className={`relative rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/50"
                        : isDisabled
                        ? "opacity-40 cursor-not-allowed border-border bg-card/40"
                        : "cursor-pointer border-border bg-card/70 hover:border-primary/50 hover:bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">
                          {shop.code}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                          {shop.city}
                        </span>
                      </div>
                      <span className="rounded bg-amber-500/15 text-amber-400 px-2 py-0.5 font-mono text-[9px] font-bold flex items-center gap-1">
                        <Zap size={10} className="fill-amber-400" /> {shop.powerCapacityKw || 240} kW
                      </span>
                    </div>

                    <h4 className="mt-2 font-display text-sm font-bold text-foreground">
                      {shop.name}
                    </h4>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                      <span>Lead: {shop.adminName}</span>
                      <span className="text-emerald-400">{shop.totalBays || 8} Bays</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job Role Selection Section */}
          <div className="space-y-3 pt-2">
            <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Briefcase size={14} /> 2. Select Grid & Technical Role *
            </label>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => {
                const isSelected = selectedRole?._id === role._id;
                return (
                  <div
                    key={role._id}
                    onClick={() => setSelectedRole(role)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/50"
                        : "border-border bg-card/70 hover:border-primary/50 hover:bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">
                        {role.level}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {role.department.split(" ")[0]}
                      </span>
                    </div>

                    <h4 className="mt-2 font-display text-sm font-bold text-foreground">
                      {role.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                      {role.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedShop || !selectedRole}
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              Proceed to Personal Particulars
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Personal & Identity Data */}
      {step === 2 && (
        <div className="rounded-2xl border border-border bg-card/70 p-6 space-y-6 shadow-sm">
          <div className="space-y-4">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <User size={14} /> Technician Identity & Contact Particulars
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-foreground">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="e.g. Vikram"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="e.g. Deshmukh"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Official Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="vikram.deshmukh@esarthi-ev.internal"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Technician Badge / Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Residential Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="Flat / Street, Locality, City, State"
                />
              </div>
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent cursor-pointer"
            >
              Back to Station Selection
            </button>
            <button
              type="button"
              disabled={!firstName.trim() || !lastName.trim()}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              Proceed to EV Certs & Safety
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: EV Certifications, Bay Assignment & Safety */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card/75 p-6 space-y-6 shadow-sm">
          {/* Station Bay & Shift Schedule */}
          <div className="space-y-4">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" /> EV Station Bay & Shift Roster
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-foreground">Assigned Charging Bays</label>
                <input
                  type="text"
                  value={assignedBay}
                  onChange={(e) => setAssignedBay(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none font-mono"
                  placeholder="e.g. Bays 01-04 (DC Fast 360kW)"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Shift Schedule</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none cursor-pointer"
                >
                  <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                  <option value="Evening Peak Shift (14:00 - 22:00)">Evening Peak Shift (14:00 - 22:00)</option>
                  <option value="Night Roster (22:00 - 06:00)">Night Roster (22:00 - 06:00)</option>
                  <option value="General Inspection (09:00 - 17:30)">General Inspection (09:00 - 17:30)</option>
                </select>
              </div>
            </div>
          </div>

          {/* High-Voltage Certifications & Safety Clearance */}
          <div className="space-y-4 border-t border-border/80 pt-5">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Award size={14} /> High-Voltage Certifications & Safety Clearance
            </h4>

            <div>
              <label className="text-xs font-medium text-foreground">Technical Certifications (Comma-separated)</label>
              <input
                type="text"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none font-mono"
                placeholder="High-Voltage Safety Certified (Level 4), OCPP 2.0.1 Protocol"
              />
            </div>

            {/* Safety PPE Toggle */}
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <input
                type="checkbox"
                id="ppeCheck"
                checked={safetyEquipmentCleared}
                onChange={(e) => setSafetyEquipmentCleared(e.target.checked)}
                className="size-4.5 rounded text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="ppeCheck" className="text-xs font-medium text-foreground cursor-pointer">
                <strong>1000V Insulated Tool & PPE Clearance Verified</strong>
                <span className="block text-[11px] text-muted-foreground mt-0.5">
                  Technician holds active Arc Flash (NFPA 70E / IEC 61851) gear inspection certificate.
                </span>
              </label>
            </div>
          </div>

          {/* Employment & Compensation */}
          <div className="space-y-4 border-t border-border/80 pt-5">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <DollarSign size={14} /> Compensation & Contract Particulars
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-foreground">Agreement Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none cursor-pointer"
                >
                  <option value="Full-time">Full-time Permanent</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contractual Specialist</option>
                  <option value="Intern">Trainee</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Monthly Compensation</label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="e.g. ₹1,20,000 / mo"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Joining Date</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4 border-t border-border/80 pt-5">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
              Emergency Contact Information
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-foreground">Emergency Contact Name *</label>
                <input
                  type="text"
                  required
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="Name of next of kin / spouse"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Emergency Phone *</label>
                <input
                  type="tel"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="+91 98765 00000"
                />
              </div>
            </div>
          </div>

          {/* Submission Buttons */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent cursor-pointer"
            >
              Back to Personal Data
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
            >
              <Check size={15} />
              {isSubmitting ? "Deploying Technician..." : "Complete Technician Onboarding"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
