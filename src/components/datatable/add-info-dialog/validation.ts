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
    if (text === "") continue;
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

// Validate newly entered list items while allowing existing items to be removed
// or corrected one at a time. Save-time validation still checks the whole list.
export const validateConfiguredInput = (
  next: unknown,
  previous: unknown,
  rule?: FieldValidation
): string => {
  if (!Array.isArray(next)) return validateConfiguredField(next, rule);
  const remaining = Array.isArray(previous) ? [...previous] : [];
  for (const item of next) {
    const existingIndex = remaining.indexOf(item);
    if (existingIndex >= 0) {
      remaining.splice(existingIndex, 1);
      continue;
    }
    const error = validateConfiguredField(item, rule);
    if (error) return error;
  }
  return "";
};
