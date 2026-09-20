import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  Sparkles,
} from "lucide-react";
import { JobRole } from "../../types";

interface RolesManagementProps {
  roles: JobRole[];
  onOpenCreateRole: () => void;
  onEditRole: (role: JobRole) => void;
  onDeleteRole: (id: string) => void;
  departments: string[];
}

export const RolesManagement: React.FC<RolesManagementProps> = ({
  roles,
  onOpenCreateRole,
  onEditRole,
  onDeleteRole,
  departments,
}) => {
  const [selectedDept, setSelectedDept] = useState("all");
  const [search, setSearch] = useState("");

  const filteredRoles = roles.filter((r) => {
    const matchesDept = selectedDept === "all" || r.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 rise">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-primary uppercase">
            ORGANIZATIONAL STRUCTURE
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Job Roles & Positions
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Define roles, seniority levels, required competencies, and responsibility milestones
          </p>
        </div>

        <button
          onClick={onOpenCreateRole}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors cursor-pointer tap-active w-full sm:w-auto"
        >
          <Plus size={15} />
          Create New Role
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roles or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-card/70 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedDept("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedDept === "all"
                ? "bg-primary text-primary-foreground font-semibold"
                : "border border-border bg-card/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            All Vertical
          </button>
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDept(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDept === d
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "border border-border bg-card/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Roles Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoles.map((role) => (
          <div
            key={role._id}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card/60 p-6 transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase size={18} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-primary/30 bg-accent px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                    {role.level}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditRole(role)}
                      className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      title="Edit Role"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteRole(role._id)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Delete Role"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {role.title}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {role.department}
                </p>
              </div>

              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {role.description}
              </p>

              {/* Responsibilities list */}
              {role.responsibilities && role.responsibilities.length > 0 && (
                <div className="mt-4 space-y-1 border-t border-border/60 pt-3">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    Core Mandate
                  </p>
                  <ul className="space-y-1 text-xs text-foreground/80">
                    {role.responsibilities.slice(0, 2).map((resp, i) => (
                      <li key={i} className="flex items-start gap-1.5 truncate text-[11px]">
                        <CheckCircle2 size={12} className="shrink-0 text-primary mt-0.5" />
                        <span className="truncate">{resp}</span>
                      </li>
                    ))}
                    {role.responsibilities.length > 2 && (
                      <p className="font-mono text-[9px] text-primary">
                        +{role.responsibilities.length - 2} more responsibilities
                      </p>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Skills */}
            {role.skills && role.skills.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
                {role.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-border bg-secondary/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredRoles.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Briefcase size={28} className="mx-auto text-muted-foreground/60" />
            <h4 className="mt-3 font-display text-base font-semibold text-foreground">
              No matching job roles
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your filter or create a new job role.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
