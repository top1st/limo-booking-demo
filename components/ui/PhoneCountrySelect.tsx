"use client";

import { PickerChevronIcon } from "@/components/ui/FieldIcons";
import { getCountryCallingCode } from "react-phone-number-input";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";

interface CountryOption {
  value?: string;
  label: string;
  divider?: boolean;
}

interface PhoneCountrySelectProps {
  value?: string;
  onChange: (country?: string) => void;
  options: CountryOption[];
  disabled?: boolean;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  iconComponent?: ElementType<{
    country: string;
    label: string;
  }>;
  "aria-label"?: string;
}

const PRIORITY_COUNTRIES = ["US", "CA", "GB", "AU", "DE", "FR"];

export function PhoneCountrySelect({
  value,
  onChange,
  options,
  disabled = false,
  readOnly = false,
  onFocus,
  onBlur,
  iconComponent: Icon,
  "aria-label": ariaLabel = "Phone number country",
}: PhoneCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchId = useId();
  const listId = useId();

  const countryOptions = useMemo(
    () => options.filter((option): option is CountryOption & { value: string } => {
      return Boolean(option.value && !option.divider);
    }),
    [options],
  );

  const selected = countryOptions.find((option) => option.value === value);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return countryOptions;
    }

    return countryOptions.filter((option) => {
      const code = option.value.toLowerCase();
      const callingCode = getCountryCallingCode(option.value as Parameters<
        typeof getCountryCallingCode
      >[0]);

      return (
        option.label.toLowerCase().includes(query) ||
        code.includes(query) ||
        callingCode.includes(query.replace(/^\+/, ""))
      );
    });
  }, [countryOptions, search]);

  const { priorityList, restList } = useMemo(() => {
    if (search.trim()) {
      return { priorityList: [], restList: filtered };
    }

    const priority = PRIORITY_COUNTRIES.map((code) =>
      countryOptions.find((option) => option.value === code),
    ).filter((option): option is CountryOption & { value: string } => Boolean(option));

    const prioritySet = new Set(priority.map((option) => option.value));
    const rest = filtered.filter((option) => !prioritySet.has(option.value));

    return { priorityList: priority, restList: rest };
  }, [countryOptions, filtered, search]);

  const close = () => {
    setOpen(false);
    setSearch("");
    onBlur?.();
  };

  const openList = () => {
    if (disabled || readOnly) {
      return;
    }

    setOpen(true);
    onFocus?.();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }

      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectCountry = (country?: string) => {
    onChange(country);
    close();
  };

  const renderOption = (option: CountryOption & { value: string }) => {
    const isSelected = option.value === value;
    let callingCode = "";

    try {
      callingCode = `+${getCountryCallingCode(option.value as Parameters<typeof getCountryCallingCode>[0])}`;
    } catch {
      callingCode = "";
    }

    return (
      <button
        key={option.value}
        type="button"
        role="option"
        aria-selected={isSelected}
        onClick={() => selectCountry(option.value)}
        className={`country-select-option ${isSelected ? "country-select-option--selected" : ""}`}
      >
        <span className="country-select-option__flag">
          {Icon ? <Icon country={option.value} label={option.label} /> : null}
        </span>
        <span className="country-select-option__label">{option.label}</span>
        <span className="country-select-option__code">{callingCode}</span>
      </button>
    );
  };

  return (
    <div
      ref={rootRef}
      className="PhoneInputCountry phone-country-select"
      data-picker-root
    >
      <button
        type="button"
        className={`phone-country-trigger ${open ? "phone-country-trigger--open" : ""}`}
        onClick={() => (open ? close() : openList())}
        disabled={disabled || readOnly}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
      >
        <span className="phone-country-trigger__flag">
          {value && Icon ? (
            <Icon country={value} label={selected?.label ?? value} />
          ) : null}
        </span>
        <PickerChevronIcon />
      </button>

      {open ? (
        <div className="picker-popover country-select-popover" role="dialog" aria-label="Choose country">
          <div className="picker-popover__header picker-popover__header--compact">
            <p className="picker-popover__title">Select country</p>
          </div>

          <div className="country-select-search">
            <input
              id={searchId}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search country or code"
              className="country-select-search__input"
              autoComplete="off"
            />
          </div>

          <div id={listId} className="country-select-list" role="listbox">
            {priorityList.length > 0 ? (
              <>
                <p className="country-select-group-label">Popular</p>
                {priorityList.map(renderOption)}
                <p className="country-select-group-label">All countries</p>
              </>
            ) : null}
            {restList.length > 0 ? (
              restList.map(renderOption)
            ) : (
              <p className="country-select-empty">No countries found</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
