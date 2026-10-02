export type FieldValidation = {
  pattern?: string;
  integer?: boolean;
  min?: number;
  max?: number;
  max_length?: number;
  message?: string;
};

// Rules are supplied by data_config.columns; fields without rules are unrestricted.
export const validateConfiguredField = (value: unknown, rule?: FieldValidation): string => {
  if (!rule) return "";
  const values = Array.isArray(value) ? value : [value];
  for (const item of values) {
    const text = String(item ?? "");
    if (!text.trim()) continue;
    let invalid = rule.max_length !== undefined && text.length > rule.max_length;
    if (rule.pattern) {
      try {
        invalid = invalid || !new RegExp(rule.pattern, "u").test(text);
      } catch {
        return "This field's validation configuration is invalid. Please contact an administrator.";
      }
    }
    if (rule.integer) invalid = invalid || !/^\d+$/.test(text) || !Number.isSafeInteger(Number(text));
    if (rule.min !== undefined) invalid = invalid || !Number.isFinite(Number(text)) || Number(text) < rule.min;
    if (rule.max !== undefined) invalid = invalid || !Number.isFinite(Number(text)) || Number(text) > rule.max;
    if (invalid) return rule.message || "Please enter a valid value.";
  }
  return "";
};
