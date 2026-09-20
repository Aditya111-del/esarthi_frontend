import React, { useState } from "react";
import {
  Zap,
  ShieldCheck,
  Building2,
  ArrowRight,
  AlertCircle,
  Lock,
  Radio,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import { UserSession, Shop } from "../../types";
import { api } from "../../services/api";

interface LoginPageProps {
  onLogin: (user: UserSession) => void;
  shops: Shop[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, shops }) => {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const presetBranches = [
    {
      code: "EV-DEL-01",
      city: "Delhi",
      stationName: "Connaught Plaza EV Superhub",
      adminName: "Rajesh Kumar",
      email: "delhi.admin@esarthi.com",
    },
    {
      code: "EV-BLR-01",
      city: "Bengaluru",
      stationName: "Silicon Expressway Charging Depot",
      adminName: "Vikram Malhotra",
      email: "bengaluru.admin@esarthi.com",
    },
    {
      code: "EV-MUM-01",
      city: "Mumbai",
      stationName: "BKC Green Fleet Supercharger",
      adminName: "Sneha Patel",
      email: "mumbai.admin@esarthi.com",
    },
    {
      code: "EV-HYD-01",
      city: "Hyderabad",
      stationName: "HITEC City EV Transit Hub",
      adminName: "Karthik Reddy",
      email: "hyderabad.admin@esarthi.com",
    },
  ];

  const additionalShops = shops.filter(
    (s) =>
      !["EV-DEL-01", "EV-BLR-01", "EV-MUM-01", "EV-HYD-01"].includes(s.code?.toUpperCase()) &&
      s.adminEmail?.endsWith("@esarthi.com")
  );

  const handleAuthorize = async (emailToTry?: string) => {
    const targetEmail = (emailToTry || emailInput).trim().toLowerCase();
    setErrorMessage("");

    if (!targetEmail) {
      setErrorMessage("Please enter an authorized @esarthi.com ID");
      return;
    }

    setIsLoading(true);

    try {
      const authenticatedUser = await api.login(targetEmail, shops);
      onLogin(authenticatedUser);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "Authentication failed. Only superadmin@esarthi.com and provisioned @esarthi.com store admin accounts have access."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (email: string) => {
    setEmailInput(email);
    handleAuthorize(email);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "oklch(0.095 0.010 240)",
        color: "oklch(0.970 0.004 240)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          maxWidth: "900px",
          height: "450px",
          background: "radial-gradient(ellipse at center, oklch(0.680 0.158 155 / 0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Brand Bar */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          borderBottom: "1px solid oklch(0.220 0.012 240 / 0.40)",
          background: "oklch(0.120 0.012 240 / 0.60)",
          backdropFilter: "blur(16px)",
          padding: "0.875rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "10px",
              background: "linear-gradient(135deg, oklch(0.680 0.158 155) 0%, oklch(0.580 0.160 155) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 0 16px oklch(0.680 0.158 155 / 0.40)",
            }}
          >
            <Zap size={18} style={{ fill: "currentColor" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "oklch(0.980 0.005 240)",
                }}
              >
                ESARTHI
              </span>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  background: "oklch(0.680 0.158 155 / 0.12)",
                  color: "oklch(0.760 0.150 155)",
                  border: "1px solid oklch(0.680 0.158 155 / 0.25)",
                  borderRadius: "9999px",
                  padding: "1px 6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <span className="es-dot" style={{ width: "4px", height: "4px" }} />
                GRID OS v2
              </span>
            </div>
            <p style={{ fontSize: "0.6875rem", color: "oklch(0.480 0.012 240)", margin: 0 }}>
              Workforce Management & Station Operations
            </p>
          </div>
        </div>

        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.6875rem",
            color: "oklch(0.480 0.012 240)",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          <span className="es-dot" />
          <span>4 Primary Hubs Connected</span>
        </div>
      </header>

      {/* Main Authentication Card Area */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          maxWidth: "34rem",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Title & Subtitle */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.25rem 0.625rem",
              borderRadius: "9999px",
              background: "oklch(0.120 0.012 240 / 0.80)",
              border: "1px solid oklch(0.240 0.012 240 / 0.50)",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.6875rem",
              color: "oklch(0.760 0.150 155)",
              marginBottom: "0.625rem",
            }}
          >
            <ShieldCheck size={12} />
            <span>Authorized Enterprise Access</span>
          </div>

          <h1
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "1.875rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "oklch(0.980 0.005 240)",
              margin: "0 0 0.375rem",
            }}
          >
            Sign in to <span style={{ color: "oklch(0.760 0.150 155)" }}>ESARTHI</span>
          </h1>

          <p style={{ fontSize: "0.8125rem", color: "oklch(0.500 0.012 240)", margin: 0 }}>
            Direct access configured for verified <code style={{ fontFamily: '"JetBrains Mono", monospace', color: "oklch(0.850 0.005 240)" }}>@esarthi.com</code> IDs
          </p>
        </div>

        {/* Central Card */}
        <div
          className="es-card"
          style={{
            width: "100%",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Identity Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuthorize();
            }}
            style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
          >
            <div className="es-form-group">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label className="es-label" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <Lock size={11} style={{ color: "oklch(0.680 0.158 155)" }} />
                  Corporate Admin Email
                </label>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.625rem",
                    color: "oklch(0.420 0.012 240)",
                  }}
                >
                  @esarthi.com
                </span>
              </div>

              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="superadmin@esarthi.com or branch.admin@esarthi.com"
                className="es-input"
                style={{ height: "2.75rem", fontSize: "0.8125rem", fontFamily: '"JetBrains Mono", monospace' }}
                autoFocus
              />
            </div>

            {errorMessage && (
              <div
                style={{
                  padding: "0.625rem 0.875rem",
                  borderRadius: "8px",
                  background: "oklch(0.580 0.230 27 / 0.12)",
                  border: "1px solid oklch(0.580 0.230 27 / 0.35)",
                  color: "oklch(0.700 0.200 27)",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="es-btn es-btn-primary"
              style={{
                height: "2.75rem",
                fontSize: "0.8125rem",
                justifyContent: "center",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              {isLoading ? "Verifying Authorization..." : "Authorize & Launch Dashboard"}
              {!isLoading && <ArrowRight size={14} />}
            </button>
          </form>

          {/* Section Divider */}
          <div className="es-section-label">
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.625rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "oklch(0.420 0.012 240)",
              }}
            >
              One-Click Direct Login
            </span>
          </div>

          {/* Superadmin Card Button */}
          <button
            onClick={() => handleQuickSelect("superadmin@esarthi.com")}
            className="es-card es-card-hover tap-active"
            style={{
              padding: "0.875rem 1rem",
              cursor: "pointer",
              border: "1px solid oklch(0.680 0.158 155 / 0.35)",
              background: "linear-gradient(90deg, oklch(0.680 0.158 155 / 0.10) 0%, oklch(0.120 0.012 240) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "left",
              textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "10px",
                  background: "oklch(0.680 0.158 155)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 12px oklch(0.680 0.158 155 / 0.40)",
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: "0.875rem", fontWeight: 700, color: "oklch(0.980 0.005 240)" }}>
                    Suraj Sev Sagar
                  </span>
                  <span className="es-badge es-badge-emerald" style={{ fontSize: "0.5625rem", padding: "1px 5px" }}>
                    SUPERADMIN
                  </span>
                </div>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", color: "oklch(0.500 0.012 240)", margin: "2px 0 0" }}>
                  superadmin@esarthi.com
                </p>
              </div>
            </div>
            <ChevronRight size={15} style={{ color: "oklch(0.680 0.158 155)" }} />
          </button>

          {/* 4 Branch Hub Admins */}
          <div>
            <p
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.625rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "oklch(0.480 0.012 240)",
                margin: "0 0 0.5rem 0.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              <Building2 size={11} style={{ color: "oklch(0.680 0.158 155)" }} />
              Branch Station Managers
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {presetBranches.map((branch) => (
                <button
                  key={branch.code}
                  onClick={() => handleQuickSelect(branch.email)}
                  className="es-card es-card-hover tap-active"
                  style={{
                    padding: "0.625rem 0.75rem",
                    cursor: "pointer",
                    textAlign: "left",
                    background: "oklch(0.100 0.010 240)",
                    border: "1px solid oklch(0.220 0.012 240 / 0.40)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: "0.75rem", fontWeight: 700, color: "oklch(0.760 0.150 155)" }}>
                      {branch.city} Hub
                    </span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.5625rem", color: "oklch(0.420 0.012 240)" }}>
                      {branch.code}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "oklch(0.900 0.005 240)", margin: "2px 0 0" }}>
                    {branch.adminName}
                  </p>
                  <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {branch.email}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Dynamic Shops if any */}
          {additionalShops.length > 0 && (
            <div>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", margin: "0 0 0.375rem 0.25rem", textTransform: "uppercase" }}>
                Additional Hubs
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {additionalShops.map((s) => (
                  <button
                    key={s._id}
                    onClick={() => handleQuickSelect(s.adminEmail)}
                    className="es-card es-card-hover tap-active"
                    style={{ padding: "0.5rem 0.625rem", textAlign: "left", cursor: "pointer" }}
                  >
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "oklch(0.900 0.005 240)" }}>{s.name}</span>
                    <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.420 0.012 240)", margin: "2px 0 0" }}>{s.adminEmail}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security badges */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.6875rem",
            color: "oklch(0.420 0.012 240)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <CheckCircle2 size={12} style={{ color: "oklch(0.680 0.158 155)" }} />
            <span>256-Bit TLS</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Shield size={12} style={{ color: "oklch(0.680 0.158 155)" }} />
            <span>Role-Scoped</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Layers size={12} style={{ color: "oklch(0.680 0.158 155)" }} />
            <span>Multi-Hub Sync</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)",
          padding: "1rem",
          textAlign: "center",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.6875rem",
          color: "oklch(0.380 0.010 240)",
        }}
      >
        ESARTHI Workforce & Grid Operating System · Enterprise EV Architecture
      </footer>
    </div>
  );
};
