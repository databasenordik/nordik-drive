// DropdownDatePicker.test.tsx
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DropdownDatePicker from "./DropDownPicker";

jest.mock("@mui/material", () => {
  const React = require("react");

  return {
    TextField: ({ label, value, onChange, children }: any) => (
      <label>
        {label}
        <select aria-label={label} value={value} onChange={onChange}>
          <option value=""></option>
          {children}
        </select>
      </label>
    ),
    MenuItem: ({ value, children }: any) => (
      <option value={value}>{children}</option>
    ),
  };
});

describe("DropdownDatePicker", () => {
  const currentYear = new Date().getFullYear().toString();

  it("renders day, month, and year dropdowns", () => {
    render(<DropdownDatePicker value="" onChange={jest.fn()} />);

    expect(screen.getByLabelText("Day")).toBeInTheDocument();
    expect(screen.getByLabelText("Month")).toBeInTheDocument();
    expect(screen.getByLabelText("Year")).toBeInTheDocument();
  });

  it("prefills dropdowns from yyyy-mm-dd value", async () => {
    const onChange = jest.fn();

    render(<DropdownDatePicker value="2021-03-07" onChange={onChange} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Day")).toHaveValue("07");
      expect(screen.getByLabelText("Month")).toHaveValue("March");
      expect(screen.getByLabelText("Year")).toHaveValue("2021");
    });

    // Loading a stored date must not create an edit.
    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it("does not call onChange until all three fields are selected", () => {
    const onChange = jest.fn();

    render(<DropdownDatePicker value="" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Day"), {
      target: { value: "09" },
    });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Month"), {
      target: { value: "April" },
    });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Year"), {
      target: { value: "2020" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("2020-04-09");
  });

  it("pads month with leading zero when needed", () => {
    const onChange = jest.fn();

    render(<DropdownDatePicker value="" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Day"), {
      target: { value: "01" },
    });
    fireEvent.change(screen.getByLabelText("Month"), {
      target: { value: "January" },
    });
    fireEvent.change(screen.getByLabelText("Year"), {
      target: { value: currentYear },
    });

    expect(onChange).toHaveBeenCalledWith(`${currentYear}-01-01`);
  });

  it("leaves dropdowns empty when value is invalid", () => {
    const onChange = jest.fn();

    render(<DropdownDatePicker value="invalid-value" onChange={onChange} />);

    expect(screen.getByLabelText("Day")).toHaveValue("");
    expect(screen.getByLabelText("Month")).toHaveValue("");
    expect(screen.getByLabelText("Year")).toHaveValue("");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("updates dropdowns when the value prop changes", async () => {
    const onChange = jest.fn();

    const { rerender } = render(
      <DropdownDatePicker value="2020-01-01" onChange={onChange} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Day")).toHaveValue("01");
      expect(screen.getByLabelText("Month")).toHaveValue("January");
      expect(screen.getByLabelText("Year")).toHaveValue("2020");
    });

    rerender(<DropdownDatePicker value="1999-12-15" onChange={onChange} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Day")).toHaveValue("15");
      expect(screen.getByLabelText("Month")).toHaveValue("December");
      expect(screen.getByLabelText("Year")).toHaveValue("1999");
    });

    expect(onChange).not.toHaveBeenCalled();
  });
  it("clears the dropdowns when the parent resets the date", () => {
    const onChange = jest.fn();
    const { rerender } = render(<DropdownDatePicker value="2020-01-01" onChange={onChange} />);
    rerender(<DropdownDatePicker value="" onChange={onChange} />);
    expect(screen.getByLabelText("Day")).toHaveValue("");
    expect(screen.getByLabelText("Month")).toHaveValue("");
    expect(screen.getByLabelText("Year")).toHaveValue("");
    expect(onChange).not.toHaveBeenCalled();
  });

});