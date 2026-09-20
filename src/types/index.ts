export interface Shop {
  _id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  status: "active" | "inactive";
  stationType?: string;
  powerCapacityKw?: number;
  totalBays?: number;
  activeBays?: number;
  supportedConnectors?: string[];
  uptimePercent?: number;
  dailyEnergyKwh?: number;
  employeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  shopId: string;
  shopName: string;
  department: string;
  roleTitle: string;
  roleId: string;
  level: string;
  status: "Active" | "Onboarding" | "Review" | "On Leave";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  salary?: string;
  joiningDate: string;
  dateOfBirth?: string;
  address?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  skills: string[];
  certifications?: string[];
  assignedBay?: string;
  shift?: string;
  safetyEquipmentCleared?: boolean;
  bio: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobRole {
  _id: string;
  title: string;
  department: string;
  level: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  status: "active" | "archived";
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  lead: string;
  description: string;
}

export interface DepartmentBreakdown {
  department: string;
  count: number;
  percentage: number;
}

export interface ShopBreakdown {
  shopId: string;
  shopName: string;
  count: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onboardingEmployees: number;
  reviewEmployees: number;
  onLeaveEmployees: number;
  totalRoles: number;
  totalDepartments: number;
  totalShops: number;
  totalPowerCapacityKw?: number;
  totalChargingBays?: number;
  activeChargingBays?: number;
  networkUptimePercent?: number;
  energyDeliveredMwhToday?: number;
  departmentBreakdown: DepartmentBreakdown[];
  shopBreakdown: ShopBreakdown[];
  databaseConnected: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  type: "superadmin" | "shopadmin" | "employee";
  role: string;
  assignedShopId?: string;
  assignedShopName?: string;
}
