"use client";

import PhoneInput, { type Value } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";

interface InternationalPhoneInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InternationalPhoneInput({
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = "774 415 3244",
}: InternationalPhoneInputProps) {
  return (
    <div className="phone-input-field">
      <PhoneInput
        id={id}
        international
        defaultCountry="US"
        countryCallingCodeEditable={false}
        labels={en}
        value={(value || undefined) as Value | undefined}
        onChange={(next) => onChange(next ?? "")}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className="PhoneInput--custom"
      />
    </div>
  );
}
