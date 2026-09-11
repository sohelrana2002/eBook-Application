"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker({
  value,
  onChange,
  className = "",
  fromYear = 2000,
  toYear = new Date().getFullYear() + 5,
}) {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  // HANDLE FROM DATE SELECT
  const handleFromSelect = (selectedDate) => {
    onChange({
      from: selectedDate,
      to:
        value?.to && selectedDate && selectedDate > value.to
          ? undefined
          : value?.to,
    });
    setOpenFrom(false);
  };

  // HANDLE TO DATE SELECT
  const handleToSelect = (selectedDate) => {
    onChange({
      from: value?.from,
      to: selectedDate,
    });
    setOpenTo(false);
  };

  // CLEAR INDIVIDUAL DATES
  const clearFromDate = (e) => {
    e.stopPropagation();
    e.preventDefault();

    onChange({
      from: undefined,
      to: value?.to,
    });
  };

  const clearToDate = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onChange({
      from: value?.from,
      to: undefined,
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* FROM DATE PICKER */}
      <Field className="w-auto">
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <div className="relative flex items-center">
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[160px] justify-start px-2.5 font-normal text-left pr-7"
              >
                <CalendarIcon className="mr-[5px] h-4 w-4 shrink-0 text-muted-foreground" />
                {value?.from ? (
                  format(new Date(value.from), "LLL dd, y")
                ) : (
                  <span className="text-muted-foreground">Start Date</span>
                )}
              </Button>
            </PopoverTrigger>
            {value?.from && (
              <button
                type="button"
                onClick={clearFromDate}
                className="absolute right-1 p-1 text-muted-foreground hover:text-black rounded-full hover:bg-gray-200 transition-colors z-10"
                title="Clear From Date"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <PopoverContent className="w-auto p-3" align="start">
            <Calendar
              mode="single"
              selected={value?.from ? new Date(value.from) : undefined}
              defaultMonth={value?.from ? new Date(value.from) : new Date()}
              captionLayout="dropdown"
              fromYear={fromYear}
              toYear={toYear}
              onSelect={handleFromSelect}
              classNames={{
                caption_label: "hidden",
                caption_dropdowns: "flex justify-center gap-1 my-1 w-full",
                dropdown:
                  "p-1 rounded-md border text-xs bg-background cursor-pointer focus:outline-none",
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <span className="text-gray-400 font-medium">-</span>

      {/* TO DATE PICKER */}
      <Field className="w-auto">
        <Popover open={openTo} onOpenChange={setOpenTo}>
          <div className="relative flex items-center">
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[160px] justify-start px-2.5 font-normal text-left pr-7"
              >
                <CalendarIcon className="mr-[5px] h-4 w-4 shrink-0 text-muted-foreground" />
                {value?.to ? (
                  format(new Date(value.to), "LLL dd, y")
                ) : (
                  <span className="text-muted-foreground">End Date</span>
                )}
              </Button>
            </PopoverTrigger>
            {value?.to && (
              <button
                type="button"
                onClick={clearToDate}
                className="absolute right-1 p-1 text-muted-foreground hover:text-black rounded-full hover:bg-gray-200 transition-colors z-10"
                title="Clear To Date"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <PopoverContent className="w-auto p-3" align="start">
            <Calendar
              mode="single"
              selected={value?.to ? new Date(value.to) : undefined}
              defaultMonth={
                value?.to
                  ? new Date(value.to)
                  : value?.from
                    ? new Date(value.from)
                    : new Date()
              }
              captionLayout="dropdown"
              fromYear={fromYear}
              toYear={toYear}
              disabled={(date) =>
                value?.from ? date < new Date(value.from) : false
              }
              onSelect={handleToSelect}
              classNames={{
                caption_label: "hidden",
                caption_dropdowns: "flex justify-center gap-1 my-1 w-full",
                dropdown:
                  "p-1 rounded-md border text-xs bg-background cursor-pointer focus:outline-none",
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </div>
  );
}
