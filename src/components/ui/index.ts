// Core primitives
export { Button } from "./core/button";
export { Card } from "./core/card";
export { Avatar } from "./core/avatar";
export { ProjectDot } from "./core/project-dot";
export { StatCard } from "./core/stat-card";
export { Logo } from "./core/logo";
export { Tag, type TagStatus } from "./core/tag";

// Form controls
export { Field, FieldLabel } from "./form/field";
export { FieldShell, fieldShellClass } from "./form/field-shell";
export { Select, type SelectOption } from "./form/select";
export { DateField } from "./form/date-field";
export { TimeField } from "./form/time-field";
export { Toggle } from "./form/toggle";
export { Checkbox } from "./form/checkbox";
export { SegmentedControl } from "./form/segmented-control";
export { ColorPicker } from "./form/color-picker";
export { FieldGroup, FormRow } from "./form/form-layout";
export { InlineFormError } from "./form/inline-form-error";

// Navigation & shell
export { Breadcrumb } from "./nav/breadcrumb";
export { PageHeader } from "./nav/page-header";
export { FilterRail } from "./nav/filter-rail";

// Data display
export { Table, TableHeader, TableRow } from "./data/table";
export { EntryRow } from "./data/entry-row";
export { RowEditAffordance } from "./data/row-edit-affordance";
export {
  CollapsibleGroupRow,
  CollapsibleChildRow,
} from "./data/collapsible-group-row";
export { GroupHeader } from "./data/group-header";
export { KpiRow } from "./data/kpi-row";
export { BarChart, ChartLegend } from "./data/bar-chart";
export { StatusTimeline } from "./data/status-timeline";
export { SummaryTotals } from "./data/summary-totals";

// Overlays & feedback
export { Modal } from "./overlay/modal";
export { ConfirmDialog } from "./overlay/confirm-dialog";
export { AuthCard } from "./overlay/auth-card";
export { EmptyState } from "./overlay/empty-state";
export { ErrorState } from "./overlay/error-state";
export { Toast } from "./overlay/toast";
export { ToastProvider, useToast } from "./overlay/toast-provider";
export type { ToastVariant } from "./overlay/toast-card";
