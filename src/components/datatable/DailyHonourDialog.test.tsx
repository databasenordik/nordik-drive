import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DailyHonourDialog, { formatHonourDate } from "./DailyHonourDialog";

describe("DailyHonourDialog", () => {
  it("formats ISO dates as a readable long date and leaves other values alone", () => {
    expect(formatHonourDate("2026-10-15")).toBe("Thursday, October 15, 2026");
    expect(formatHonourDate("Oct 15")).toBe("Oct 15");
    expect(formatHonourDate(undefined)).toBe("");
  });

  it("shows the title, date, and each paragraph, with the last one as the dedication", () => {
    render(
      <DailyHonourDialog
        open
        loading={false}
        date="2026-10-15"
        honourText={"First paragraph.\n\nWe remember them today."}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByRole("dialog", { name: "Today's honour" })).toBeInTheDocument();
    expect(screen.getByTestId("daily-honour-date")).toHaveTextContent("Thursday, October 15, 2026");
    expect(screen.getByText("First paragraph.")).toHaveStyle("font-style: normal");
    expect(screen.getByText("We remember them today.")).toHaveStyle("font-style: italic");
  });

  it("shows a loading message while the honour is loading", () => {
    render(<DailyHonourDialog open loading honourText="" onClose={jest.fn()} />);

    expect(screen.getByTestId("daily-honour-loading")).toHaveTextContent("Loading today's honour");
  });

  it("closes from the close icon, Close, and Continue to records", () => {
    const onClose = jest.fn();
    render(<DailyHonourDialog open loading={false} honourText="Text" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close today's honour" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: /continue to records/i }));

    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
