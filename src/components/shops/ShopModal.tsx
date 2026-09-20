import React, { useState, useEffect, FormEvent } from "react";
import { X, Store, Save, ShieldCheck, Zap } from "lucide-react";
import { Shop } from "../../types";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shopData: Partial<Shop>) => Promise<void>;
  initialData?: Shop | null;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [stationType, setStationType] = useState("Ultra-Fast Highway Hub");
  const [powerCapacityKw, setPowerCapacityKw] = useState(240);
  const [totalBays, setTotalBays] = useState(8);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCode(initialData.code);
      setCity(initialData.city);
      setAddress(initialData.address || "");
      setContactEmail(initialData.contactEmail || "");
      setContactPhone(initialData.contactPhone || "");
      setAdminName(initialData.adminName || "");
      setAdminEmail(initialData.adminEmail || "");
      setAdminPhone(initialData.adminPhone || "");
      setStationType(initialData.stationType || "Ultra-Fast Highway Hub");
      setPowerCapacityKw(initialData.powerCapacityKw || 240);
      setTotalBays(initialData.totalBays || 8);
      setStatus(initialData.status || "active");
    } else {
      setName("");
      setCode("");
      setCity("");
      setAddress("");
      setContactEmail("");
      setContactPhone("");
      setAdminName("");
      setAdminEmail("");
      setAdminPhone("");
      setStationType("Ultra-Fast Highway Hub");
      setPowerCapacityKw(240);
      setTotalBays(8);
      setStatus("active");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !adminName.trim()) {
      setError("Station name, city, and Station Admin name are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedCode =
        code.trim() ||
        `EV-${city.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

      let finalAdminEmail = adminEmail.trim().toLowerCase();
      if (!finalAdminEmail) {
        const cleanName = adminName.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
        finalAdminEmail = `${cleanName || "admin"}@esarthi.com`;
      } else if (!finalAdminEmail.includes("@")) {
        finalAdminEmail = `${finalAdminEmail}@esarthi.com`;
      } else if (!finalAdminEmail.endsWith("@esarthi.com")) {
        finalAdminEmail = `${finalAdminEmail.split("@")[0]}@esarthi.com`;
      }

      await onSave({
        _id: initialData?._id,
        name: name.trim(),
        code: generatedCode,
        city: city.trim(),
        address: address.trim(),
        contactEmail: contactEmail.trim() || `station.${generatedCode.toLowerCase()}@esarthi.com`,
        contactPhone: contactPhone.trim(),
        adminName: adminName.trim(),
        adminEmail: finalAdminEmail,
        adminPhone: adminPhone.trim(),
        stationType,
        powerCapacityKw: Number(powerCapacityKw),
        totalBays: Number(totalBays),
        activeBays: Math.max(1, Math.round(Number(totalBays) * 0.75)),
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save charging hub");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-2.5 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-auto w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store size={16} />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                {initialData ? "Edit Shop / Branch" : "Create New Shop / Branch"}
              </h3>
              <p className="font-mono text-[9.5px] sm:text-[10px] text-muted-foreground">
                SUPERADMIN ACTION · MULTI-TENANT PROVISIONING
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer tap-active"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          {/* Shop Particulars */}
          <div className="space-y-4">
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Shop Particulars
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Shop / Branch Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="e.g. ESARTHI Flagship — Connaught Place"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Shop Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="e.g. SHP-DEL-01"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Operating City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="e.g. New Delhi"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="Plot / Street, Landmark, Pincode"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Shop Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="delhi.hub@esarthi.internal"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Station Contact Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="+91 11 2345 6789"
                />
              </div>
            </div>
          </div>

          {/* EV Charging & Grid Power Specs */}
          <div className="space-y-4 pt-2 border-t border-border/80">
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Zap size={13} className="fill-primary text-primary" /> EV Charging & Grid Infrastructure
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-foreground">Power Capacity (kW DC) *</label>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  step="10"
                  value={powerCapacityKw}
                  onChange={(e) => setPowerCapacityKw(Number(e.target.value))}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="360"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Total Dispenser Bays *</label>
                <input
                  type="number"
                  min="2"
                  max="64"
                  value={totalBays}
                  onChange={(e) => setTotalBays(Number(e.target.value))}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Station Archetype</label>
                <select
                  value={stationType}
                  onChange={(e) => setStationType(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-2 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                >
                  <option value="Ultra-Fast Highway & Urban Hub">Highway Supercharger</option>
                  <option value="Hypercharger Matrix & Fleet Terminal">Fleet Hypercharger</option>
                  <option value="Dual-Cabinet Fleet Supercharger">Dual-Cabinet DC Hub</option>
                  <option value="Metro Transit & Ride-Hail Hub">Transit & Ride-Hail Hub</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assigned Shop Admin Details */}
          <div className="space-y-4 border-t border-border/80 pt-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                Designated Shop Admin
              </h4>
            </div>
            <p className="text-[11px] text-muted-foreground">
              This administrator will hold operational control to onboard staff and manage this shop's roster.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-foreground">Shop Admin Full Name *</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="e.g. Rajesh Kumar"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    Shop Admin Login ID (@esarthi.com)
                  </label>
                  <span className="text-[10px] font-mono font-semibold text-primary">
                    Login Identity
                  </span>
                </div>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="e.g. jaipur.admin@esarthi.com"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Configured with @esarthi.com. This ID can sign into this branch from the Login Page without password or OTP.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Shop Admin Phone</label>
                <input
                  type="tel"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="+91 98100 12345"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Shop Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                >
                  <option value="active">Active & Operational</option>
                  <option value="inactive">Inactive / Setup Mode</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 border-t border-border pt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer tap-active text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 cursor-pointer tap-active"
            >
              <Save size={14} />
              {isSubmitting ? "Saving..." : initialData ? "Update Shop" : "Provision Shop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
