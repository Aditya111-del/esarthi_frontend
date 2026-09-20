import React, { useState, useEffect, FormEvent } from "react";
import { X, Briefcase, Save } from "lucide-react";
import { JobRole } from "../../types";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: Partial<JobRole>) => Promise<void>;
  initialData?: JobRole | null;
  departments: string[];
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  departments,
}) => {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [level, setLevel] = useState("L3");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [skills, setSkills] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDepartment(initialData.department);
      setLevel(initialData.level);
      setDescription(initialData.description);
      setResponsibilities(
        Array.isArray(initialData.responsibilities)
          ? initialData.responsibilities.join("\n")
          : ""
      );
      setSkills(
        Array.isArray(initialData.skills) ? initialData.skills.join(", ") : ""
      );
    } else {
      setTitle("");
      setDepartment("Engineering");
      setLevel("L3");
      setDescription("");
      setResponsibilities("");
      setSkills("");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Role title is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSave({
        _id: initialData?._id,
        title: title.trim(),
        department,
        level,
        description: description.trim(),
        responsibilities: responsibilities
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        status: "active",
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save job role");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Briefcase size={16} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                {initialData ? "Edit Job Role" : "Create New Job Role"}
              </h3>
              <p className="font-mono text-[10px] text-muted-foreground">
                ESARTHI Position Specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-foreground">Role Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
              placeholder="e.g. Lead Cloud Architect"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-foreground">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Seniority Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
              >
                <option value="L1">L1 — Associate</option>
                <option value="L2">L2 — Mid-Level</option>
                <option value="L3">L3 — Senior</option>
                <option value="L4">L4 — Staff / Lead</option>
                <option value="L5">L5 — Principal / Director</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">Role Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
              placeholder="Overview of expectations, mandate, and team collaboration..."
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">
              Key Responsibilities (One per line)
            </label>
            <textarea
              rows={3}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none"
              placeholder="Lead system design and distributed services&#10;Mentor junior software engineers&#10;Enforce security and performance standards"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">
              Required Skills (Comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:border-primary/50 focus:outline-none"
              placeholder="React, Node.js, Architecture, MongoDB"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50"
            >
              <Save size={14} />
              {isSubmitting ? "Publishing..." : initialData ? "Save Changes" : "Publish Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
