"use client";

import React from "react";
import { ChevronUp, ChevronDown, SlidersHorizontal, UserPlus } from "lucide-react";

type Props = {
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddStudent: () => void;
};

/* "Hide filter" + "Add student" row. */
export default function CommunityActionBar({ filterOpen, setFilterOpen, onAddStudent }: Props) {
  return (
    <div className="community-action-bar">
      <button
        className="dv-btn"
        onClick={() => setFilterOpen((p) => !p)}
        aria-expanded={filterOpen}
        type="button"
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        {filterOpen ? "Hide filter" : "Show filter"}
        <span className="dv-btn-trailing" aria-hidden="true">
          {filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      <button className="dv-btn dv-btn-primary" type="button" onClick={onAddStudent}>
        <UserPlus size={18} aria-hidden="true" />
        Add student
      </button>

      <p className="community-action-msg" role="note">
        <span className="community-action-msg-greeting">Aanii, Boozhoo, Wachéye, Sago!</span>{" "}
        We welcome you to add and/or edit any information in the Shingwauk student list that is missing or
        inaccurate. Chi-miigwetch!
      </p>
    </div>
  );
}
