import { validateConfiguredField, validateConfiguredInput } from "./validation";

const names = { pattern: "^[\\p{L}\\p{M} ]+$", message: "Only letters and spaces are allowed." };
const age = { integer: true, min: 0, max: 140, max_length: 3 };

describe("configuration-driven Add Info validation", () => {
  it("accepts Unicode names and spaces, including combining marks", () => {
    for (const name of ["Mary Jane", "\u00c9lodie", "Jose\u0301", "\u140a\u14c2\u1528\u14c8\u1431"]) {
      expect(validateConfiguredField(name, names)).toBe("");
    }
  });
  it("rejects numbers, punctuation, and tabs in each name entry", () => {
    for (const name of ["Jane2", "Anne-Marie", "O'Neil", "Jane\tDoe", "\t"]) {
      expect(validateConfiguredField(["Valid Name", name], names)).toBe(names.message);
    }
  });
  it("validates the whole-number age boundaries and length", () => {
    for (const value of ["0", "9", "99", "140"]) expect(validateConfiguredField(value, age)).toBe("");
    for (const value of ["141", "1000", "0140", "-1", "1.5", "1e2", "abc", " 14 ", " ", "\t"]) {
      expect(validateConfiguredField(value, age)).not.toBe("");
    }
  });
  it("leaves optional empty fields and fields without rules unrestricted", () => {
    expect(validateConfiguredField("", names)).toBe("");
    expect(validateConfiguredField(["", "Jane"], names)).toBe("");
    expect(validateConfiguredField("Nickname #2, other details!")).toBe("");
  });
  it("fails safely for a malformed configured regex", () => {
    expect(validateConfiguredField("Jane", { pattern: "[" })).toContain("configuration is invalid");
  });
  it("blocks a newly typed invalid list item but permits correcting older entries", () => {
    expect(validateConfiguredInput(["Anna", "Bob2"], ["Anna", "Bob"], names)).toBe(names.message);
    expect(validateConfiguredInput(["Anna", "Bob2"], ["Anna1", "Bob2"], names)).toBe("");
    expect(validateConfiguredInput(["Anna1"], ["Anna1", "Bob2"], names)).toBe("");
    expect(validateConfiguredInput(["Anna1", "Anna1"], ["Anna1"], names)).toBe(names.message);
  });

});
