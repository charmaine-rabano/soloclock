"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { fieldShellClass } from "./field-shell";

type Meridiem = "AM" | "PM";

interface TimeValue {
  hour: string;
  minute: string;
  meridiem: Meridiem;
}

interface TimeFieldProps {
  defaultValue?: string;
  defaultMeridiem?: Meridiem;
  onChange?: (value: TimeValue) => void;
  compact?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function TimeField({
  defaultValue,
  defaultMeridiem = "AM",
  onChange,
  compact = false,
  className,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: TimeFieldProps) {
  const [initialHour = "", initialMinute = ""] = (defaultValue ?? "").split(
    ":",
  );
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [meridiem, setMeridiem] = useState<Meridiem>(defaultMeridiem);
  const minuteRef = useRef<HTMLInputElement>(null);

  function emit(next: Partial<TimeValue>) {
    onChange?.({
      hour: next.hour ?? hour,
      minute: next.minute ?? minute,
      meridiem: next.meridiem ?? meridiem,
    });
  }

  function handleHourChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    if (digits !== "" && Number(digits) > 12) return;
    setHour(digits);
    emit({ hour: digits });
    if (digits.length === 2) minuteRef.current?.focus();
  }

  function handleMinuteChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    if (digits !== "" && Number(digits) > 59) return;
    setMinute(digits);
    emit({ minute: digits });
  }

  function handleMinuteBlur() {
    if (minute.length === 1) {
      const padded = minute.padStart(2, "0");
      setMinute(padded);
      emit({ minute: padded });
    }
  }

  function toggleMeridiem() {
    const next = meridiem === "AM" ? "PM" : "AM";
    setMeridiem(next);
    emit({ meridiem: next });
  }

  return (
    <div
      id={id}
      className={fieldShellClass(
        { align: "start", compact },
        cn(
          "gap-1 font-mono focus-within:border-accent focus-within:shadow-[0_0_0_3px] focus-within:shadow-accent-ring",
          className,
        ),
      )}
    >
      <input
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel ? `${ariaLabel} hour` : undefined}
        aria-labelledby={ariaLabelledby}
        placeholder="--"
        value={hour}
        onChange={(event) => handleHourChange(event.target.value)}
        className="w-4.5 bg-transparent text-right outline-none placeholder:text-subtle"
      />
      <span className="text-subtle">:</span>
      <input
        ref={minuteRef}
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel ? `${ariaLabel} minute` : undefined}
        placeholder="--"
        value={minute}
        onChange={(event) => handleMinuteChange(event.target.value)}
        onBlur={handleMinuteBlur}
        className="w-4.5 bg-transparent outline-none placeholder:text-subtle"
      />
      <button
        type="button"
        onClick={toggleMeridiem}
        className="ml-auto cursor-pointer text-subtle hover:text-foreground"
      >
        {meridiem}
      </button>
    </div>
  );
}
