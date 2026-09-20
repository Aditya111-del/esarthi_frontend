import React, { useState } from "react";
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
  // If not logged in, show clean Login Screen
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
                  name: "Suraj Dev Sagar",
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
              <p className="mt-0.5 text-[11px] text-muted-foreground">Suraj Dev Sagar (Manage all stores & staff)</p>
            </button>

            {shops.map((shop) => (
              <button
                key={shop._id}
                onClick={() =>
                  onLogin({
                    id: `admin-${shop._id}`,
                    name: shop.adminName,
                    email: shop.adminEmail,
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
                  <span className="text-[10px] font-mono text-muted-foreground">{shop.city}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Store Manager · {shop.name}</p>
              </button>
            ))}

            <button
              onClick={() =>
                onLogin({
                  id: "emp-sample",
                  name: "Marcus Webb",
                  email: "m.webb@esarthi-ev.internal",
                  type: "employee",
                  role: "High-Voltage Field Engineer",
                })
              }
              className="w-full rounded-xl border border-border bg-secondary/30 p-3 text-left transition-all hover:bg-secondary/60 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <User size={14} className="text-muted-foreground" /> Marcus Webb
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">Field Staff</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Senior Field Engineer</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Find matching employee record for this user session if any
  const matchedEmp = employees.find(
    (e) =>
      e.email.toLowerCase() === currentUser.email.toLowerCase() ||
      e.name.toLowerCase() === currentUser.name.toLowerCase()
  ) || employees[0];

  const matchedShop = shops.find(
    (s) => s._id === matchedEmp?.shopId || s.name === matchedEmp?.shopName
  ) || shops[0];

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(matchedEmp?.phone || "");
  const [address, setAddress] = useState(matchedEmp?.address || "");
  const [emergencyName, setEmergencyName] = useState(matchedEmp?.emergencyName || "");
  const [emergencyPhone, setEmergencyPhone] = useState(matchedEmp?.emergencyPhone || "");
  const [skills, setSkills] = useState(matchedEmp?.skills?.join(", ") || "");
  const [bio, setBio] = useState(matchedEmp?.bio || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!matchedEmp) return;
    setIsSaving(true);
    try {
      await onUpdateEmployee(matchedEmp._id, {
        phone,
        address,
        emergencyName,
        emergencyPhone,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        bio,
      });
      setIsEditing(false);
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
                alt={matchedEmp.name}
                className="size-16 sm:size-20 rounded-2xl object-cover border-2 border-primary/40 shadow-xl shrink-0"
              />
            ) : (
              <div className="flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-secondary font-display text-2xl font-bold text-foreground border border-border shadow-xl shrink-0">
                {currentUser.name?.[0] || "U"}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {matchedEmp?.name || currentUser.name}
                </h2>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                  {matchedEmp?.status || "Active"}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {matchedEmp?.roleTitle || currentUser.role} · {matchedEmp?.shopName || matchedShop?.name || "Central"}
              </p>
              <p className="font-mono text-[11px] text-primary">
                ID: {matchedEmp?.employeeId || "ES-AUTH-01"} · {matchedEmp?.department || "Operations"}
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
              <p className="font-bold text-foreground mt-0.5">{matchedEmp?.name || currentUser.name}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Email Address</span>
              <p className="font-medium text-foreground mt-0.5">{matchedEmp?.email || currentUser.email}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Phone Number</span>
              {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-8 w-full rounded border border-border bg-background px-2 text-xs"
                />
              ) : (
                <p className="font-medium text-foreground mt-0.5">{matchedEmp?.phone || "+91 98111 22334"}</p>
              )}
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Date of Birth</span>
              <p className="font-mono text-foreground mt-0.5">{matchedEmp?.dateOfBirth || "1992-11-14"}</p>
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
                <p className="font-medium text-foreground mt-0.5">{matchedEmp?.address || "Registered Address on file"}</p>
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
                  <p className="font-medium text-foreground mt-0.5">{matchedEmp?.emergencyName || "Sarah Webb"}</p>
                )}
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">Emergency Phone</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="mt-1 h-8 w-full rounded border border-border bg-background px-2 text-xs"
                  />
                ) : (
                  <p className="font-mono text-foreground mt-0.5">{matchedEmp?.emergencyPhone || "+91 98111 88990"}</p>
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
                <p className="text-muted-foreground mt-0.5 leading-relaxed">{matchedEmp?.bio || "No bio registered."}</p>
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
              <p className="font-mono font-bold text-primary mt-0.5">{matchedEmp?.employeeId || "ES-EMP-1088"}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Role & Level</span>
              <p className="font-bold text-foreground mt-0.5">
                {matchedEmp?.roleTitle || currentUser.role} ({matchedEmp?.level || "L4"})
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Department</span>
              <p className="font-medium text-foreground mt-0.5">{matchedEmp?.department || "Operations"}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Monthly Salary</span>
              <p className="font-medium text-foreground mt-0.5">{matchedEmp?.salary || "₹1,35,000 / mo"}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Store / Shop Working In</span>
              <p className="font-bold text-foreground mt-0.5">{matchedEmp?.shopName || matchedShop?.name}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Joining Date</span>
              <p className="font-mono font-medium text-foreground mt-0.5">{matchedEmp?.joiningDate || "2023-04-10"}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Employment Type</span>
              <p className="font-medium text-foreground mt-0.5">{matchedEmp?.employmentType || "Full-time Permanent"}</p>
            </div>

            {/* Shop Admin / Manager */}
            <div className="pt-3 border-t border-border/50 rounded-lg bg-secondary/30 p-3">
              <span className="font-mono text-[10px] font-bold text-primary uppercase">
                Shop Manager / Admin In-Charge
              </span>
              <p className="font-bold text-foreground mt-1">{matchedShop?.adminName || "Rajesh Kumar"}</p>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                {matchedShop?.adminEmail || "rajesh.kumar@esarthi.internal"} · {matchedShop?.adminPhone || "+91 98100 12345"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
