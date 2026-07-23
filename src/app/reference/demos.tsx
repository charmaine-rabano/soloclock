"use client";

import { useState } from "react";

import {
  Button,
  Checkbox,
  CollapsibleChildRow,
  CollapsibleGroupRow,
  ColorPicker,
  ConfirmDialog,
  Field,
  FieldGroup,
  FieldLabel,
  FilterRail,
  Modal,
  SegmentedControl,
  Select,
  Tag,
  Toggle,
} from "@/components/ui";

export function ToggleDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex items-center justify-between rounded-field border border-border bg-surface px-3 py-2.5">
      <Toggle checked={checked} onCheckedChange={setChecked} label="Billable" />
    </div>
  );
}

export function SegmentedControlDemo() {
  const [value, setValue] = useState("day");
  return (
    <div className="max-w-52">
      <SegmentedControl
        value={value}
        onValueChange={setValue}
        options={[
          { value: "day", label: "Day" },
          { value: "project", label: "Project" },
        ]}
      />
    </div>
  );
}

export function ColorPickerDemo() {
  const [value, setValue] = useState("#56c7d6");
  return (
    <div className="max-w-md">
      <ColorPicker
        value={value}
        onChange={setValue}
        suggestions={["#56c7d6", "#a78bfa", "#f27db4"]}
      />
    </div>
  );
}

export function CollapsibleGroupRowDemo() {
  const [open, setOpen] = useState(false);
  return (
    <CollapsibleGroupRow
      open={open}
      onToggle={() => setOpen((v) => !v)}
      summary={
        <div className="flex flex-1 items-center gap-3.5">
          <span className="flex-1 text-[13.5px] font-bold">
            Hero section polish
          </span>
          <span className="font-mono text-[13.5px] font-bold">2h 40m</span>
          <Tag status="count">×2</Tag>
        </div>
      }
    >
      <CollapsibleChildRow>
        9:00 AM – 10:15 AM · Layout pass
      </CollapsibleChildRow>
      <CollapsibleChildRow>2:00 PM – 3:25 PM · Copy tweaks</CollapsibleChildRow>
    </CollapsibleGroupRow>
  );
}

export function FilterRailDemo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="overflow-hidden rounded-card border border-border-field">
      <FilterRail
        collapsed={collapsed}
        onCollapse={() => setCollapsed(true)}
        onExpand={() => setCollapsed(false)}
      >
        <FieldGroup>
          <FieldLabel>Client</FieldLabel>
          <Select
            compact
            defaultValue="all"
            options={[
              { value: "all", label: "All clients", separatorAfter: true },
              { value: "acme", label: "Acme Co" },
              { value: "bright", label: "Bright Media" },
              { value: "northwind", label: "Northwind" },
              { value: "lumen", label: "Lumen Labs" },
            ]}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel>Group by</FieldLabel>
          <SegmentedControlDemo />
        </FieldGroup>
      </FilterRail>
    </div>
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open manual entry
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Manual entry"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-1.75">
          <FieldLabel required>Project</FieldLabel>
          <Field placeholder="Choose a project" />
        </div>
        <div className="flex flex-col gap-1.75">
          <FieldLabel optional>Description</FieldLabel>
          <Field placeholder="What did you work on?" />
        </div>
      </Modal>
    </>
  );
}

export function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Void invoice
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Void this invoice?"
        body="INV-0007 will be marked void. This can't be undone."
        confirmLabel="Void invoice"
        variant="destructive"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-4">
      <Checkbox defaultChecked />
      <Checkbox />
      <Checkbox disabled />
    </div>
  );
}
