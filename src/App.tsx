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
import { api, defaultSuperadmin } from "./services/api";
import { Employee, JobRole, Shop, DashboardStats, UserSession } from "./types";

export function App() {
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [user, setUser] = useState<UserSession | null>(defaultSuperadmin);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [departments, setDepartments] = useState<string[]>([
    "Engineering",
    "Design & UX",
    "Product",
    "Analytics & Insights",
    "People Operations",
  ]);
  const [databaseConnected, setDatabaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Load initial data
  const loadData = async (shopFilter = "all") => {
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
    }
  };

  useEffect(() => {
    loadData(selectedShopFilter);
  }, [selectedShopFilter]);

  // Handle persona switching
  const handleSelectPersona = (persona: UserSession) => {
    setUser(persona);
    if (persona.type === "shopadmin" && persona.assignedShopId) {
      setSelectedShopFilter(persona.assignedShopId);
      toast.info(`Switched to Shop Admin: ${persona.name} (${persona.assignedShopName || "Shop"})`);
    } else if (persona.type === "superadmin") {
      setSelectedShopFilter("all");
      toast.success("Switched to Superadmin Mode (Full Multi-Shop Authority)");
    } else {
      toast.info("Switched to Employee View");
    }
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <Toaster position="top-right" theme="dark" richColors />

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
          <div className="flex h-96 flex-col items-center justify-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary animate-pulse">
              <span className="font-display text-2xl font-bold">E</span>
            </div>
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Loading ESARTHI System...
            </p>
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
                  setUser({
                    id: `admin-${shop._id}`,
                    name: shop.adminName,
                    email: shop.adminEmail,
                    type: "shopadmin",
                    role: `Store Admin (${shop.city})`,
                    assignedShopId: shop._id,
                    assignedShopName: shop.name,
                  });
                  setSelectedShopFilter(shop._id);
                  toast.success(`Switched to Store Admin: ${shop.adminName}`);
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
                onLogin={(persona) => {
                  setUser(persona);
                  if (persona.type === "shopadmin" && persona.assignedShopId) {
                    setSelectedShopFilter(persona.assignedShopId);
                  } else {
                    setSelectedShopFilter("all");
                  }
                  toast.success(`Logged in as ${persona.name}`);
                }}
                onLogout={() => {
                  setUser(null);
                  toast.info("Logged out successfully");
                }}
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden items-center justify-around border-t border-border/80 bg-background/90 backdrop-blur-xl px-1 py-1.5 safe-bottom shadow-2xl">
        <button
          onClick={() => {
            setCurrentTab("overview");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-semibold transition-all tap-active cursor-pointer ${
            currentTab === "overview"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 size={18} className={currentTab === "overview" ? "text-primary" : "text-muted-foreground"} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab("roster");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-semibold transition-all tap-active cursor-pointer ${
            currentTab === "roster"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users size={18} className={currentTab === "roster" ? "text-primary" : "text-muted-foreground"} />
          <span>Staff</span>
        </button>

        {/* Floating Quick Onboard Action Button */}
        <button
          onClick={() => {
            setEditingEmployee(null);
            setIsEmployeeModalOpen(true);
          }}
          className="flex flex-col items-center justify-center -mt-5 size-11 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/35 tap-active cursor-pointer"
          title="Onboard Technician"
        >
          <UserPlus size={20} className="fill-primary-foreground text-primary-foreground" />
        </button>

        <button
          onClick={() => {
            setCurrentTab("shops");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-semibold transition-all tap-active cursor-pointer ${
            currentTab === "shops"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Store size={18} className={currentTab === "shops" ? "text-primary" : "text-muted-foreground"} />
          <span>Hubs</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab("profile");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-semibold transition-all tap-active cursor-pointer ${
            currentTab === "profile"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User size={18} className={currentTab === "profile" ? "text-primary" : "text-muted-foreground"} />
          <span>Profile</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">ESARTHI</span>
            <span>· Store Operations & Workforce Management System</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Session: {user ? user.role : "Guest (Logged Out)"}</span>
            <span>Stores Active: {shops.length}</span>
            <span>Database: {databaseConnected ? "MongoDB" : "Online"}</span>
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

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 rise">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Sign In to ESARTHI
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select an account profile to continue
                </p>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setUser(defaultSuperadmin);
                  setSelectedShopFilter("all");
                  setIsLoginModalOpen(false);
                  toast.success("Signed in as Platform Superadmin");
                }}
                className="w-full rounded-xl border border-primary/40 bg-primary/10 p-3 text-left transition-all hover:bg-primary/20 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-primary" /> Platform Superadmin
                  </span>
                  <span className="text-[10px] font-mono text-primary font-semibold">Full Access</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Aditya Salgotra (All Stores & Staff)</p>
              </button>

              {shops.map((shop) => (
                <button
                  key={shop._id}
                  onClick={() => {
                    setUser({
                      id: `admin-${shop._id}`,
                      name: shop.adminName,
                      email: shop.adminEmail,
                      type: "shopadmin",
                      role: `Store Admin (${shop.city})`,
                      assignedShopId: shop._id,
                      assignedShopName: shop.name,
                    });
                    setSelectedShopFilter(shop._id);
                    setIsLoginModalOpen(false);
                    toast.success(`Signed in as Store Admin: ${shop.adminName}`);
                  }}
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
                onClick={() => {
                  setUser({
                    id: "emp-sample",
                    name: "Marcus Webb",
                    email: "m.webb@esarthi-ev.internal",
                    type: "employee",
                    role: "Field Engineer",
                  });
                  setIsLoginModalOpen(false);
                  toast.success("Signed in as Marcus Webb");
                }}
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
      )}
    </div>
  );
}
