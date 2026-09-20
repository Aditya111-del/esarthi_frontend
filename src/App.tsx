import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
  X,
  ShieldCheck,
  Building2,
  User,
  BarChart3,
  Users,
  Store,
  UserPlus,
  Briefcase,
} from "lucide-react";
import { Navbar } from "./components/layout/Navbar";
import { AnalyticsOverview } from "./components/analytics/AnalyticsOverview";
import { EmployeeRoster } from "./components/employees/EmployeeRoster";
import { EmployeeModal } from "./components/employees/EmployeeModal";
import { EmployeeDetailDrawer } from "./components/employees/EmployeeDetailDrawer";
import { RolesManagement } from "./components/roles/RolesManagement";
import { RoleModal } from "./components/roles/RoleModal";
import { ShopsManagement } from "./components/shops/ShopsManagement";
import { ShopModal } from "./components/shops/ShopModal";
import { QuickOnboardingForm } from "./components/onboarding/QuickOnboardingForm";
import { MyProfileView } from "./components/profile/MyProfileView";
import { LoginPage } from "./components/auth/LoginPage";
import { api, defaultSuperadmin, getCached } from "./services/api";
import { Employee, JobRole, Shop, DashboardStats, UserSession } from "./types";

export function App() {
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem("esarthi_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.type === "superadmin" || parsed.email === "superadmin@esarthi.com") {
          return {
            ...parsed,
            name: "Suraj Sev Sagar",
            email: "superadmin@esarthi.com",
            role: "Platform Superadmin",
          };
        }
        return parsed;
      }
    } catch {}
    return null;
  });

  const cachedStats = getCached<DashboardStats>("stats_all");
  const cachedShops = getCached<Shop[]>("shops");
  const cachedEmployees = getCached<Employee[]>("employees_all");

  const [stats, setStats] = useState<DashboardStats | null>(cachedStats);
  const [employees, setEmployees] = useState<Employee[]>(cachedEmployees || []);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [shops, setShops] = useState<Shop[]>(cachedShops || []);
  const [departments, setDepartments] = useState<string[]>([
    "Engineering",
    "Design & UX",
    "Product",
    "Analytics & Insights",
    "People Operations",
  ]);
  const [databaseConnected, setDatabaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(!cachedShops || cachedShops.length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedShopFilter, setSelectedShopFilter] = useState("all");

  // Modals & Drawers state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [inspectingEmployee, setInspectingEmployee] = useState<Employee | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<JobRole | null>(null);

  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  // Active employee profile selection for self-service view
  const [activeProfileEmployee, setActiveProfileEmployee] = useState<Employee | null>(null);

  // Load initial data with stale-while-revalidate smooth transition
  const loadData = async (shopFilter = "all") => {
    setIsRefreshing(true);
    try {
      const [statsData, employeesData, rolesData, shopsData, deptsData] = await Promise.all([
        api.getStats(shopFilter).catch(() => null),
        api.getEmployees({ shopId: shopFilter }).catch(() => []),
        api.getRoles().catch(() => []),
        api.getShops().catch(() => []),
        api.getDepartments().catch(() => []),
      ]);

      if (statsData) {
        setStats(statsData);
        setDatabaseConnected(statsData.databaseConnected);
      }
      if (shopsData && shopsData.length > 0) {
        setShops(shopsData);
      }
      if (employeesData && employeesData.length > 0) {
        setEmployees(employeesData);
        if (!activeProfileEmployee) {
          setActiveProfileEmployee(employeesData[0]);
        }
      }
      if (rolesData && rolesData.length > 0) {
        setRoles(rolesData);
      }
      if (deptsData && deptsData.length > 0) {
        setDepartments(deptsData.map((d) => d.name));
      }
    } catch (err) {
      console.error("Error loading ESARTHI data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(selectedShopFilter);
  }, [selectedShopFilter]);

  // Handle session authorization
  const handleLogin = (authenticatedUser: UserSession) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem("esarthi_user", JSON.stringify(authenticatedUser));
    } catch {}

    if (authenticatedUser.type === "shopadmin" && authenticatedUser.assignedShopId) {
      setSelectedShopFilter(authenticatedUser.assignedShopId);
      toast.success(
        `Signed in as Store Admin: ${authenticatedUser.name} (${authenticatedUser.assignedShopName || "Store"})`
      );
    } else {
      setSelectedShopFilter("all");
      toast.success(`Signed in as ${authenticatedUser.name} (Platform Superadmin)`);
    }
  };

  // Handle session termination
  const handleLogout = () => {
    try {
      localStorage.removeItem("esarthi_user");
    } catch {}
    setUser(null);
    setSelectedShopFilter("all");
    toast.info("Logged out. Returned to Enterprise Login Portal.");
  };

  // Handle persona switching from navbar or modals
  const handleSelectPersona = (persona: UserSession | null) => {
    if (!persona) {
      handleLogout();
      return;
    }
    handleLogin(persona);
  };

  // Filtered employees for roster
  const filteredEmployees = employees.filter((emp) => {
    const matchesDept =
      selectedDepartment === "all" ||
      emp.department.toLowerCase() === selectedDepartment.toLowerCase();
    const matchesStatus =
      selectedStatus === "all" ||
      emp.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesShop =
      selectedShopFilter === "all" ||
      emp.shopId === selectedShopFilter ||
      emp.shopId === selectedShopFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.roleTitle.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      (emp.shopName && emp.shopName.toLowerCase().includes(q));

    return matchesDept && matchesStatus && matchesShop && matchesQuery;
  });

  // Employee CRUD handlers
  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    if (employeeData._id) {
      // Update
      const updated = await api.updateEmployee(employeeData._id, employeeData);
      setEmployees((prev) =>
        prev.map((e) => (e._id === updated._id ? updated : e))
      );
      if (activeProfileEmployee?._id === updated._id) {
        setActiveProfileEmployee(updated);
      }
      toast.success(`Updated ${updated.name}'s profile`);
    } else {
      // Create
      const created = await api.createEmployee(employeeData);
      setEmployees((prev) => [created, ...prev]);
      toast.success(`Registered ${created.name} in ${created.shopName}`);
    }
    // Refresh stats & shops
    api.getStats(selectedShopFilter).then(setStats).catch(() => null);
    api.getShops().then(setShops).catch(() => null);
  };

  const handleDeleteEmployee = async (id: string) => {
    if (confirm("Are you sure you want to remove this employee record?")) {
      try {
        await api.deleteEmployee(id);
        setEmployees((prev) => prev.filter((e) => e._id !== id));
        toast.success("Employee record deleted");
        api.getStats(selectedShopFilter).then(setStats).catch(() => null);
        api.getShops().then(setShops).catch(() => null);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete employee");
      }
    }
  };

  // Role CRUD handlers
  const handleSaveRole = async (roleData: Partial<JobRole>) => {
    if (roleData._id) {
      const updated = await api.updateRole(roleData._id, roleData);
      setRoles((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      toast.success(`Updated role ${updated.title}`);
    } else {
      const created = await api.createRole(roleData);
      setRoles((prev) => [created, ...prev]);
      toast.success(`Published new role: ${created.title}`);
    }
    api.getStats(selectedShopFilter).then(setStats).catch(() => null);
  };

  const handleDeleteRole = async (id: string) => {
    if (confirm("Are you sure you want to archive this job role?")) {
      try {
        await api.deleteRole(id);
        setRoles((prev) => prev.filter((r) => r._id !== id));
        toast.success("Job role archived");
        api.getStats(selectedShopFilter).then(setStats).catch(() => null);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete role");
      }
    }
  };

  // Shop CRUD handlers
  const handleSaveShop = async (shopData: Partial<Shop>) => {
    if (shopData._id) {
      const updated = await api.updateShop(shopData._id, shopData);
      setShops((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
      toast.success(`Updated ${updated.name}`);
    } else {
      const created = await api.createShop(shopData);
      setShops((prev) => [created, ...prev]);
      toast.success(`Provisioned new shop: ${created.name}`);
    }
    api.getStats(selectedShopFilter).then(setStats).catch(() => null);
  };

  const handleDeleteShop = async (id: string) => {
    if (confirm("Are you sure you want to delete this shop establishment?")) {
      try {
        await api.deleteShop(id);
        setShops((prev) => prev.filter((s) => s._id !== id));
        if (selectedShopFilter === id) setSelectedShopFilter("all");
        toast.success("Shop deleted successfully");
        api.getStats(selectedShopFilter).then(setStats).catch(() => null);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete shop");
      }
    }
  };

  // Complete Onboarding completion handler
  const handleOnboardingComplete = async (empData: Partial<Employee>) => {
    const created = await api.createEmployee(empData);
    setEmployees((prev) => [created, ...prev]);
    toast.success(`Successfully onboarded ${created.name} into ${created.shopName}!`);
    setActiveProfileEmployee(created);
    setCurrentTab("roster");
    api.getStats(selectedShopFilter).then(setStats).catch(() => null);
    api.getShops().then(setShops).catch(() => null);
  };

  const activeShopObj = shops.find((s) => s._id === selectedShopFilter);

  // If no user is authenticated, render the high-end enterprise Login Page
  if (!user) {
    return (
      <>
        <Toaster position="top-right" theme="dark" richColors />
        <LoginPage onLogin={handleLogin} shops={shops} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary relative">
      <Toaster position="top-right" theme="dark" richColors />

      {/* High-Tech Specular Shimmer Top Bar (Pulse during background data sync) */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-primary/20 overflow-hidden pointer-events-none">
          <div className="h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer-bar" />
        </div>
      )}

      {/* Modern Top Header Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        user={user}
        onSelectPersona={handleSelectPersona}
        employees={employees}
        shops={shops}
        onViewEmployee={(emp) => setInspectingEmployee(emp)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenAddEmployee={() => {
          setEditingEmployee(null);
          setIsEmployeeModalOpen(true);
        }}
        onOpenCreateShop={() => {
          setEditingShop(null);
          setIsShopModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 lg:pb-8">
        {isLoading ? (
          /* Luxury High-Fidelity Skeleton Screen (Prevents Layout Shifts) */
          <div className="space-y-6">
            {/* Hero Skeleton */}
            <div className="h-44 sm:h-52 w-full rounded-2xl luxury-card skeleton-shimmer" />

            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 sm:h-28 rounded-xl luxury-card p-4 flex flex-col justify-between">
                  <div className="h-3 w-16 rounded bg-white/5 skeleton-shimmer" />
                  <div className="h-7 w-24 rounded bg-white/10 skeleton-shimmer" />
                  <div className="h-2.5 w-20 rounded bg-white/5 skeleton-shimmer" />
                </div>
              ))}
            </div>

            {/* Hubs Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 pt-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 rounded-2xl luxury-card skeleton-shimmer" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* 1. Overview / Stores & Dashboard Tab */}
            {currentTab === "overview" && (
              <AnalyticsOverview
                stats={stats}
                employees={employees}
                shops={shops}
                currentUser={user}
                isSuperadmin={user?.type === "superadmin"}
                onOpenAddEmployeeForShop={(shop) => {
                  setEditingEmployee({
                    shopId: shop._id,
                    shopName: shop.name,
                  } as any);
                  setIsEmployeeModalOpen(true);
                }}
                onOpenCreateShop={() => {
                  setEditingShop(null);
                  setIsShopModalOpen(true);
                }}
                onEditShop={(shop) => {
                  setEditingShop(shop);
                  setIsShopModalOpen(true);
                }}
                onDeleteShop={handleDeleteShop}
                onViewEmployee={(emp) => setInspectingEmployee(emp)}
                onEditEmployee={(emp) => {
                  setEditingEmployee(emp);
                  setIsEmployeeModalOpen(true);
                }}
                onDeleteEmployee={handleDeleteEmployee}
              />
            )}

            {/* 2. Technicians & Staff Directory Tab */}
            {currentTab === "roster" && (
              <EmployeeRoster
                employees={filteredEmployees}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedShop={selectedShopFilter}
                onShopChange={setSelectedShopFilter}
                departments={departments}
                shops={shops}
                onViewEmployee={(emp) => setInspectingEmployee(emp)}
                onEditEmployee={(emp) => {
                  setEditingEmployee(emp);
                  setIsEmployeeModalOpen(true);
                }}
                onDeleteEmployee={handleDeleteEmployee}
                onOpenAddModal={() => {
                  setEditingEmployee(null);
                  setIsEmployeeModalOpen(true);
                }}
              />
            )}

            {/* 3. Charging Hubs & Stores Management Tab */}
            {currentTab === "shops" && (
              <ShopsManagement
                shops={shops}
                onOpenCreateShop={() => {
                  setEditingShop(null);
                  setIsShopModalOpen(true);
                }}
                onEditShop={(shop) => {
                  setEditingShop(shop);
                  setIsShopModalOpen(true);
                }}
                onDeleteShop={handleDeleteShop}
                onViewShopStaff={(shopId) => {
                  setSelectedShopFilter(shopId);
                  setCurrentTab("roster");
                }}
                onSwitchToShopAdmin={(shop) => {
                  handleLogin({
                    id: `admin-${shop._id}`,
                    name: shop.adminName,
                    email: shop.adminEmail || `${shop.city.toLowerCase().replace(/\s+/g, "")}.admin@esarthi.com`,
                    type: "shopadmin",
                    role: `Store Admin (${shop.city})`,
                    assignedShopId: shop._id,
                    assignedShopName: shop.name,
                  });
                }}
              />
            )}

            {/* 4. Job Roles & Hierarchy Tab */}
            {currentTab === "roles" && (
              <RolesManagement
                roles={roles}
                onOpenCreateRole={() => {
                  setEditingRole(null);
                  setIsRoleModalOpen(true);
                }}
                onEditRole={(role) => {
                  setEditingRole(role);
                  setIsRoleModalOpen(true);
                }}
                onDeleteRole={handleDeleteRole}
                departments={departments}
              />
            )}

            {/* 5. My Profile Workspace Tab */}
            {currentTab === "profile" && (
              <MyProfileView
                currentUser={user}
                employees={employees}
                shops={shops}
                onUpdateEmployee={async (id, updates) => {
                  await handleSaveEmployee({ _id: id, ...updates });
                }}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            )}

            {/* 6. Quick Onboarding Form Tab */}
            {currentTab === "onboard" && (
              <div className="max-w-3xl mx-auto">
                <QuickOnboardingForm
                  shops={shops}
                  roles={roles}
                  currentUser={user || defaultSuperadmin}
                  onComplete={handleOnboardingComplete}
                  onCancel={() => setCurrentTab("overview")}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Luxury Frosted Mobile Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden items-center justify-around px-1 py-1.5 safe-bottom"
        style={{
          background: "oklch(0.118 0.012 240 / 0.90)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid oklch(0.220 0.012 240 / 0.50)",
          boxShadow: "0 -8px 24px oklch(0 0 0 / 0.50)",
        }}
      >
        <button
          onClick={() => {
            setCurrentTab("overview");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="tap-active"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: currentTab === "overview" ? "oklch(0.760 0.150 155)" : "oklch(0.480 0.012 240)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <BarChart3 size={17} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab("roster");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="tap-active"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: currentTab === "roster" ? "oklch(0.760 0.150 155)" : "oklch(0.480 0.012 240)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Users size={17} />
          <span>Staff</span>
        </button>

        {/* Floating Quick Onboard Button */}
        <button
          onClick={() => {
            setEditingEmployee(null);
            setIsEmployeeModalOpen(true);
          }}
          className="tap-active es-btn es-btn-primary"
          style={{
            width: "2.625rem",
            height: "2.625rem",
            borderRadius: "14px",
            marginTop: "-1.25rem",
            padding: 0,
            justifyContent: "center",
            boxShadow: "0 4px 16px oklch(0.680 0.158 155 / 0.45)",
          }}
          title="Onboard Technician"
        >
          <UserPlus size={18} />
        </button>

        <button
          onClick={() => {
            setCurrentTab("shops");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="tap-active"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: currentTab === "shops" ? "oklch(0.760 0.150 155)" : "oklch(0.480 0.012 240)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Store size={17} />
          <span>Hubs</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab("profile");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="tap-active"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: currentTab === "profile" ? "oklch(0.760 0.150 155)" : "oklch(0.480 0.012 240)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <User size={17} />
          <span>Profile</span>
        </button>
      </nav>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid oklch(0.220 0.012 240 / 0.40)",
          padding: "1.25rem 1rem",
          background: "oklch(0.095 0.010 240)",
        }}
      >
        <div
          className="mx-auto max-w-7xl"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.6875rem",
            color: "oklch(0.420 0.012 240)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 700, color: "oklch(0.850 0.005 240)" }}>ESARTHI</span>
            <span>· Enterprise Workforce Management System</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>Active Session: <strong style={{ color: "oklch(0.760 0.150 155)" }}>{user ? user.role : "Guest"}</strong></span>
            <span>Hubs Online: <strong>{shops.length}</strong></span>
            <span>Status: <span className="es-dot" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "2px" }} /> Connected</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
        roles={roles}
        departments={departments}
        shops={shops}
      />

      {/* Shop Modal */}
      <ShopModal
        isOpen={isShopModalOpen}
        onClose={() => {
          setIsShopModalOpen(false);
          setEditingShop(null);
        }}
        onSave={handleSaveShop}
        initialData={editingShop}
      />

      {/* Employee Details Inspector Drawer */}
      <EmployeeDetailDrawer
        employee={inspectingEmployee}
        shop={shops.find(
          (s) =>
            s._id === inspectingEmployee?.shopId ||
            s.code?.toLowerCase() === inspectingEmployee?.shopId?.toLowerCase() ||
            s.name?.toLowerCase() === inspectingEmployee?.shopName?.toLowerCase()
        )}
        onClose={() => setInspectingEmployee(null)}
        onEdit={(emp) => {
          setInspectingEmployee(null);
          setEditingEmployee(emp);
          setIsEmployeeModalOpen(true);
        }}
      />

      {/* Login / Persona Switcher Modal */}
      {isLoginModalOpen && (
        <div className="es-modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div
            className="es-modal"
            style={{ maxWidth: "28rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="es-modal-header">
              <div>
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
                  Switch Session Account
                </h3>
                <p style={{ fontSize: "0.75rem", color: "oklch(0.480 0.012 240)", margin: "2px 0 0" }}>
                  Select an authorized corporate identity to switch view
                </p>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="es-btn es-btn-ghost"
                style={{ width: "1.875rem", height: "1.875rem", padding: 0 }}
              >
                <X size={15} />
              </button>
            </div>

            <div className="es-modal-body" style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {/* Superadmin Option */}
              <button
                onClick={() => {
                  handleLogin(defaultSuperadmin);
                  setIsLoginModalOpen(false);
                }}
                className="es-card es-card-hover tap-active"
                style={{
                  padding: "0.75rem 0.875rem",
                  cursor: "pointer",
                  textAlign: "left",
                  border: "1px solid oklch(0.680 0.158 155 / 0.35)",
                  background: "linear-gradient(90deg, oklch(0.680 0.158 155 / 0.10) 0%, oklch(0.120 0.012 240) 100%)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: "0.8125rem", fontWeight: 700, color: "oklch(0.980 0.005 240)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <ShieldCheck size={14} style={{ color: "oklch(0.680 0.158 155)" }} />
                    Suraj Sev Sagar
                  </span>
                  <span className="es-badge es-badge-emerald" style={{ fontSize: "0.5625rem" }}>
                    SUPERADMIN
                  </span>
                </div>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", color: "oklch(0.480 0.012 240)", margin: "2px 0 0" }}>
                  superadmin@esarthi.com
                </p>
              </button>

              {/* Shop Admins */}
              {shops.map((shop) => (
                <button
                  key={shop._id}
                  onClick={() => {
                    handleLogin({
                      id: `admin-${shop._id}`,
                      name: shop.adminName,
                      email: shop.adminEmail || `${shop.city.toLowerCase().replace(/\s+/g, "")}.admin@esarthi.com`,
                      type: "shopadmin",
                      role: `Store Admin (${shop.city})`,
                      assignedShopId: shop._id,
                      assignedShopName: shop.name,
                    });
                    setIsLoginModalOpen(false);
                  }}
                  className="es-card es-card-hover tap-active"
                  style={{ padding: "0.625rem 0.75rem", textAlign: "left", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "oklch(0.900 0.005 240)" }}>
                      {shop.adminName}
                    </span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.625rem", color: "oklch(0.760 0.150 155)" }}>
                      {shop.city}
                    </span>
                  </div>
                  <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: "0.6875rem", color: "oklch(0.420 0.012 240)", margin: "2px 0 0" }}>
                    {shop.adminEmail || `${shop.city.toLowerCase()}.admin@esarthi.com`}
                  </p>
                </button>
              ))}
            </div>

            <div className="es-modal-footer">
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  handleLogout();
                }}
                className="es-btn es-btn-ghost"
                style={{ width: "100%", justifyContent: "center", fontSize: "0.75rem" }}
              >
                Sign Out to Login Gateway →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
