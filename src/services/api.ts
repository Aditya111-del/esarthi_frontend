import { Employee, JobRole, Department, DashboardStats, UserSession, Shop } from "../types";

const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "") + "/api";

export const defaultSuperadmin: UserSession = {
  id: "superadmin-esarthi",
  name: "Aditya Salgotra",
  email: "superadmin@esarthi.internal",
  type: "superadmin",
  role: "Platform Superadmin",
};

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please verify backend connectivity.");
    }
    throw err;
  }
}

export const api = {
  // Stats
  async getStats(shopId?: string): Promise<DashboardStats> {
    const query = shopId && shopId !== "all" ? `?shopId=${encodeURIComponent(shopId)}` : "";
    const res = await fetchJson<{ success: boolean; stats: DashboardStats }>(`${API_BASE}/stats${query}`);
    return res.stats;
  },

  // Shops
  async getShops(): Promise<Shop[]> {
    const res = await fetchJson<{ success: boolean; shops: Shop[] }>(`${API_BASE}/shops`);
    return res.shops;
  },

  async getShopById(id: string): Promise<Shop & { employees: Employee[] }> {
    const res = await fetchJson<{ success: boolean; shop: Shop & { employees: Employee[] } }>(
      `${API_BASE}/shops/${id}`
    );
    return res.shop;
  },

  async createShop(data: Partial<Shop>): Promise<Shop> {
    const res = await fetchJson<{ success: boolean; shop: Shop }>(`${API_BASE}/shops`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.shop;
  },

  async updateShop(id: string, data: Partial<Shop>): Promise<Shop> {
    const res = await fetchJson<{ success: boolean; shop: Shop }>(`${API_BASE}/shops/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.shop;
  },

  async deleteShop(id: string): Promise<void> {
    await fetchJson<{ success: boolean; message: string }>(`${API_BASE}/shops/${id}`, {
      method: "DELETE",
    });
  },

  // Employees
  async getEmployees(params?: {
    search?: string;
    department?: string;
    status?: string;
    shopId?: string;
  }): Promise<Employee[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.department && params.department !== "all") query.set("department", params.department);
    if (params?.status && params.status !== "all") query.set("status", params.status);
    if (params?.shopId && params.shopId !== "all") query.set("shopId", params.shopId);

    const qs = query.toString();
    const url = `${API_BASE}/employees${qs ? `?${qs}` : ""}`;
    const res = await fetchJson<{ success: boolean; employees: Employee[] }>(url);
    return res.employees;
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const res = await fetchJson<{ success: boolean; employee: Employee }>(`${API_BASE}/employees/${id}`);
    return res.employee;
  },

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    const res = await fetchJson<{ success: boolean; employee: Employee }>(`${API_BASE}/employees`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.employee;
  },

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    const res = await fetchJson<{ success: boolean; employee: Employee }>(`${API_BASE}/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.employee;
  },

  async deleteEmployee(id: string): Promise<void> {
    await fetchJson<{ success: boolean; message: string }>(`${API_BASE}/employees/${id}`, {
      method: "DELETE",
    });
  },

  // Roles
  async getRoles(): Promise<JobRole[]> {
    const res = await fetchJson<{ success: boolean; roles: JobRole[] }>(`${API_BASE}/roles`);
    return res.roles;
  },

  async createRole(data: Partial<JobRole>): Promise<JobRole> {
    const res = await fetchJson<{ success: boolean; role: JobRole }>(`${API_BASE}/roles`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.role;
  },

  async updateRole(id: string, data: Partial<JobRole>): Promise<JobRole> {
    const res = await fetchJson<{ success: boolean; role: JobRole }>(`${API_BASE}/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.role;
  },

  async deleteRole(id: string): Promise<void> {
    await fetchJson<{ success: boolean; message: string }>(`${API_BASE}/roles/${id}`, {
      method: "DELETE",
    });
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    const res = await fetchJson<{ success: boolean; departments: Department[] }>(`${API_BASE}/departments`);
    return res.departments;
  },

  // Health
  async getHealth(): Promise<{ status: string; database: string }> {
    return fetchJson<{ status: string; database: string }>(`${API_BASE}/health`);
  },
};
