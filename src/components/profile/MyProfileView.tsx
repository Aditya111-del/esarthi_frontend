import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  Edit2,
  Save,
  LogOut,
  LogIn,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Building2,
  Zap,
  Globe,
} from "lucide-react";
import { Employee, Shop, UserSession } from "../../types";
import ecoplugDayImage from "../../assets/ecoplug-day-station.jpeg";

interface MyProfileViewProps {
  currentUser: UserSession | null;
  employees: Employee[];
  shops: Shop[];
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>;
  onLogin: (persona: UserSession) => void;
  onLogout: () => void;
}

export const MyProfileView: React.FC<MyProfileViewProps> = ({
  currentUser,
  employees,
  shops,
  onUpdateEmployee,
  onLogin,
  onLogout,
}) => {
  // If not logged in, show clean Login Gateway
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 rise">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
          <div className="text-center space-y-1">
            <h2 className="font-display text-xl font-bold text-foreground">
              Sign In to ESARTHI
            </h2>
            <p className="text-xs text-muted-foreground">
              Select your role profile to access employee & store management
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() =>
                onLogin({
                  id: "superadmin-esarthi",
                  name: "Suraj Sev Sagar",
                  email: "superadmin@esarthi.com",
                  type: "superadmin",
                  role: "Platform Superadmin",
                })
              }
              className="w-full rounded-xl border border-primary/40 bg-primary/10 p-3 text-left transition-all hover:bg-primary/20 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-primary" /> Platform Superadmin
                </span>
                <span className="text-[10px] font-mono text-primary font-semibold">Full Access</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Suraj Sev Sagar (All Stores & Staff)</p>
            </button>

            {shops.map((shop) => (
              <button
                key={shop._id}
                onClick={() =>
                  onLogin({
                    id: `admin-${shop._id}`,
                    name: shop.adminName,
                    email: shop.adminEmail || `${shop.city.toLowerCase().replace(/\s+/g, "")}.admin@esarthi.com`,
                    type: "shopadmin",
                    role: `Store Admin (${shop.city})`,
                    assignedShopId: shop._id,
                    assignedShopName: shop.name,
                  })
                }
                className="w-full rounded-xl border border-border bg-secondary/30 p-3 text-left transition-all hover:bg-secondary/60 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <Building2 size={14} className="text-muted-foreground" /> {shop.adminName}
                  </span>
                  <span className="text-[10px] font-mono text-primary font-semibold">{shop.city}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Hub Admin · {shop.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isSuperadmin =
    currentUser.type === "superadmin" ||
    currentUser.email?.toLowerCase() === "superadmin@esarthi.com";
  const isShopAdmin = currentUser.type === "shopadmin";

  // Dedicated profile state for Superadmin and Shop Admins
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load custom superadmin saved profile from localStorage if any
  const cachedSuperadminProfile = (() => {
    if (!isSuperadmin) return null;
    try {
      const saved = localStorage.getItem("esarthi_superadmin_profile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  // Match employee record ONLY if currentUser is a regular employee or has an exact email/name match
  const matchedEmp = !isSuperadmin && !isShopAdmin
    ? employees.find(
        (e) =>
          e.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
          e.name?.toLowerCase() === currentUser.name?.toLowerCase()
      )
    : null;

  // Matched shop for shopadmin
  const matchedShop = isShopAdmin
    ? shops.find(
        (s) =>
          s._id === currentUser.assignedShopId ||
          s.adminEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
          (currentUser.assignedShopName &&
            s.name.toLowerCase() === currentUser.assignedShopName.toLowerCase())
      ) || shops[0]
    : null;

  // Dynamic profile fields based on persona
  const displayName = isSuperadmin
    ? currentUser.name || "Suraj Sev Sagar"
    : isShopAdmin
    ? currentUser.name || matchedShop?.adminName || "Hub Administrator"
    : matchedEmp?.name || currentUser.name;

  const displayEmail = isSuperadmin
    ? "superadmin@esarthi.com"
    : isShopAdmin
    ? currentUser.email || matchedShop?.adminEmail || "admin@esarthi.com"
    : matchedEmp?.email || currentUser.email;

  const displayRoleTitle = isSuperadmin
    ? "Platform Superadmin"
    : isShopAdmin
    ? `Store Administrator (${matchedShop?.city || "Hub"})`
    : matchedEmp?.roleTitle || currentUser.role;

  const displayLevel = isSuperadmin
    ? "Executive (L8)"
    : isShopAdmin
    ? "Station Lead (L6)"
    : matchedEmp?.level || "L4";

  const displayDepartment = isSuperadmin
    ? "Executive Governance & Supergrid Operations"
    : isShopAdmin
    ? "Station Management & Regional Operations"
    : matchedEmp?.department || "Field Engineering";

  const displayEmployeeId = isSuperadmin
    ? "ES-SUPERADMIN-01"
    : isShopAdmin
    ? `ADM-${matchedShop?.code || "EV-01"}`
    : matchedEmp?.employeeId || "ES-EMP-1001";

  const displayShopName = isSuperadmin
    ? "All Active Charging Hubs (Delhi, Bengaluru, Mumbai, Hyderabad)"
    : isShopAdmin
    ? matchedShop?.name || currentUser.assignedShopName || "Assigned EV Hub"
    : matchedEmp?.shopName || "Central Operations";

  const displaySalary = isSuperadmin
    ? "Executive Multi-Hub Compensation"
    : isShopAdmin
    ? "₹2,50,000 / mo"
    : matchedEmp?.salary || "₹1,35,000 / mo";

  const displayJoiningDate = isSuperadmin
    ? "2021-01-15"
    : isShopAdmin
    ? "2022-03-01"
    : matchedEmp?.joiningDate || "2023-04-10";

  const displayEmploymentType = isSuperadmin
    ? "Platform Superadministrator (Full Multi-Hub Access)"
    : isShopAdmin
    ? "Full-time Station Manager"
    : matchedEmp?.employmentType || "Full-time Permanent";

  const displayShopManager = isSuperadmin
    ? {
        name: `${displayName} (Self)`,
        email: "superadmin@esarthi.com",
        phone: "+91 11 2345 0000",
        label: "National Executive In-Charge",
      }
    : isShopAdmin
    ? {
        name: `${displayName} (Self)`,
        email: displayEmail,
        phone: matchedShop?.adminPhone || "+91 98100 12345",
        label: "Designated Station Admin In-Charge",
      }
    : {
        name: matchedShop?.adminName || "Rajesh Kumar",
        email: matchedShop?.adminEmail || "delhi.admin@esarthi.com",
        phone: matchedShop?.adminPhone || "+91 98100 12345",
        label: "Shop Manager / Admin In-Charge",
      };

  // Editable fields with fallbacks
  const [phone, setPhone] = useState(
    cachedSuperadminProfile?.phone ||
      (isSuperadmin ? "+91 98100 00001" : matchedShop?.adminPhone || matchedEmp?.phone || "+91 98111 22334")
  );
  const [address, setAddress] = useState(
    cachedSuperadminProfile?.address ||
      (isSuperadmin
        ? "Central Command HQ, Connaught Place, New Delhi, DL 110001"
        : matchedShop?.address || matchedEmp?.address || "Registered Address on file")
  );
  const [emergencyName, setEmergencyName] = useState(
    cachedSuperadminProfile?.emergencyName ||
      (isSuperadmin ? "Security Operations Command (SOC)" : matchedEmp?.emergencyName || "Platform Ops Duty")
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    cachedSuperadminProfile?.emergencyPhone ||
      (isSuperadmin ? "+91 11 2345 0000" : matchedEmp?.emergencyPhone || "+91 11 2345 6789")
  );
  const [bio, setBio] = useState(
    cachedSuperadminProfile?.bio ||
      (isSuperadmin
        ? "Chief Platform Superadministrator for ESARTHI and ECOPLUG EV Network. Full authority across Delhi, Bengaluru, Mumbai, and Hyderabad charging hubs."
        : isShopAdmin
        ? `Oversees day-to-day charging bay operations, technician rotas, and power capacity uptime for ${displayShopName}.`
        : matchedEmp?.bio || "Field Specialist overseeing EV charging operations.")
  );

  useEffect(() => {
    if (isSuperadmin) {
      if (cachedSuperadminProfile?.phone) setPhone(cachedSuperadminProfile.phone);
      if (cachedSuperadminProfile?.address) setAddress(cachedSuperadminProfile.address);
      if (cachedSuperadminProfile?.emergencyName) setEmergencyName(cachedSuperadminProfile.emergencyName);
      if (cachedSuperadminProfile?.emergencyPhone) setEmergencyPhone(cachedSuperadminProfile.emergencyPhone);
      if (cachedSuperadminProfile?.bio) setBio(cachedSuperadminProfile.bio);
    }
  }, [currentUser]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isSuperadmin) {
        const profileData = { phone, address, emergencyName, emergencyPhone, bio };
        localStorage.setItem("esarthi_superadmin_profile", JSON.stringify(profileData));
        setIsEditing(false);
      } else if (matchedEmp) {
        await onUpdateEmployee(matchedEmp._id, {
          phone,
          address,
          emergencyName,
          emergencyPhone,
          bio,
        });
        setIsEditing(false);
      } else {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 rise">
      {/* Profile Visual Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <div className="absolute inset-0 z-0">
          <img
            src={ecoplugDayImage}
            alt="ESARTHI Station Operations"
            className="h-full w-full object-cover object-center brightness-30 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {matchedEmp?.image ? (
              <img
                src={matchedEmp.image}
                alt={displayName}
                className="size-16 sm:size-20 rounded-2xl object-cover border-2 border-primary/40 shadow-xl shrink-0"
              />
            ) : (
              <div className="flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-primary/20 text-primary font-display text-2xl font-black border border-primary/35 shadow-xl shrink-0">
                {displayName?.[0] || "S"}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {displayName}
                </h2>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                  {isSuperadmin ? "Superadmin Active" : "Active"}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {displayRoleTitle} · {isSuperadmin ? "All 4 Hubs" : displayShopName}
              </p>
              <p className="font-mono text-[11px] text-primary">
                ID: {displayEmployeeId} · {displayDepartment}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-center justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white hover:bg-black/60 transition-colors cursor-pointer backdrop-blur-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-md"
                >
                  <Save size={13} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-black/60 transition-colors cursor-pointer backdrop-blur-md"
              >
                <Edit2 size={13} />
                Edit Profile
              </button>
            )}

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-destructive/30 transition-colors cursor-pointer backdrop-blur-md"
            >
              <LogOut size={13} />
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Profile Grid: Personal Details + Organization Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* SECTION 1: Personal Details */}
        <div className="rounded-xl border border-border bg-card/70 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
            <User size={16} className="text-primary" />
            <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-wider">
              Personal Details
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Full Name</span>
              <p className="font-bold text-foreground mt-0.5">{displayName}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Email Address</span>
              <p className="font-medium text-foreground mt-0.5 font-mono">{displayEmail}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Phone Number</span>
              {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-8 w-full rounded border border-border bg-background px-2 text-xs font-mono"
                />
              ) : (
                <p className="font-medium text-foreground mt-0.5 font-mono">{phone}</p>
              )}
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Date of Birth</span>
              <p className="font-mono text-foreground mt-0.5">
                {isSuperadmin ? "1985-05-18" : matchedEmp?.dateOfBirth || "1990-08-15"}
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Residential Address</span>
              {isEditing ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 h-8 w-full rounded border border-border bg-background px-2 text-xs"
                />
              ) : (
                <p className="font-medium text-foreground mt-0.5">{address}</p>
              )}
            </div>

            <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-2">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Emergency Contact</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="mt-1 h-8 w-full rounded border border-border bg-background px-2 text-xs"
                  />
                ) : (
                  <p className="font-medium text-foreground mt-0.5">{emergencyName}</p>
                )}
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Emergency Phone</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="mt-1 h-8 w-full rounded border border-border bg-background px-2 text-xs font-mono"
                  />
                ) : (
                  <p className="font-mono text-foreground mt-0.5">{emergencyPhone}</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Bio / Background</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 w-full rounded border border-border bg-background p-2 text-xs"
                />
              ) : (
                <p className="text-muted-foreground mt-0.5 leading-relaxed">{bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Organization Details */}
        <div className="rounded-xl border border-border bg-card/70 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
            <Building size={16} className="text-primary" />
            <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-wider">
              Organization Details
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Employee ID</span>
              <p className="font-mono font-bold text-primary mt-0.5">{displayEmployeeId}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Role & Level</span>
              <p className="font-bold text-foreground mt-0.5">
                {displayRoleTitle} ({displayLevel})
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Department</span>
              <p className="font-medium text-foreground mt-0.5">{displayDepartment}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Monthly Salary</span>
              <p className="font-medium text-foreground mt-0.5">{displaySalary}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                {isSuperadmin ? "Multi-Store Authority" : "Store / Shop Working In"}
              </span>
              <p className="font-bold text-foreground mt-0.5">{displayShopName}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Joining Date</span>
              <p className="font-mono font-medium text-foreground mt-0.5">{displayJoiningDate}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Employment Type</span>
              <p className="font-medium text-foreground mt-0.5">{displayEmploymentType}</p>
            </div>

            {/* Shop Admin / Manager */}
            <div className="pt-3 border-t border-border/50 rounded-lg bg-secondary/30 p-3">
              <span className="font-mono text-[10px] font-bold text-primary uppercase">
                {displayShopManager.label}
              </span>
              <p className="font-bold text-foreground mt-1">{displayShopManager.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                {displayShopManager.email} · {displayShopManager.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
