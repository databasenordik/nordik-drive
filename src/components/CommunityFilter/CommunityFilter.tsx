import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCommunities } from "../../store/auth/fileSlice";
import {
  COMMUNITY_FILTER_ACCENT,
  COMMUNITY_FILTER_COLORS,
  COMMUNITY_FILTER_LAYOUT,
} from "./constants";
import {
  COMMUNITY_FILTER_MESSAGES,
  getSelectVisibleAriaLabel,
  getSelectVisibleLabel,
  getSelectedCountAriaLabel,
} from "./messages";

type CommunityFilterProps = {
  onClose?: () => void;
  showClose?: boolean;
};

const CommunityFilter: React.FC<CommunityFilterProps> = ({ onClose, showClose }) => {
  const dispatch = useDispatch();
  const communities: string[] = useSelector(
    (state: any) => state.file?.communities ?? []
  );
  const selected: string[] = useSelector(
    (state: any) => state.file?.selectedCommunities ?? []
  );

  const [query, setQuery] = useState("");
  const firstRenderRef = useRef(true);

  const updateSelected = useCallback(
    (next: string[]) => dispatch(setSelectedCommunities({ selected: next })),
    [dispatch]
  );

  useEffect(() => {
    if (firstRenderRef.current) firstRenderRef.current = false;
  }, [communities]);

  useEffect(() => {
    if (!selected?.length) return;
    const setComm = new Set(communities);
    const sanitized = selected.filter((s) => setComm.has(s));
    if (sanitized.length !== selected.length) updateSelected(sanitized);
  }, [communities, selected, updateSelected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return communities;
    return communities.filter((c) => String(c).toLowerCase().includes(q));
  }, [communities, query]);

  const toggle = useCallback(
    (community: string) => {
      const next = selected.includes(community)
        ? selected.filter((c) => c !== community)
        : [...selected, community];
      updateSelected(next);
    },
    [selected, updateSelected]
  );

  const selectAllVisible = useCallback(() => {
    const setPrev = new Set(selected);
    filtered.forEach((c) => setPrev.add(c));
    updateSelected(Array.from(setPrev));
  }, [filtered, selected, updateSelected]);

  const clearSelection = useCallback(() => updateSelected([]), [updateSelected]);
  const clearQuery = useCallback(() => setQuery(""), []);

  const L = COMMUNITY_FILTER_LAYOUT;
  const C = COMMUNITY_FILTER_COLORS;
  const hasSelection = selected.length > 0;

  return (
    <div
      aria-label={COMMUNITY_FILTER_MESSAGES.panelAriaLabel}
      className="cf-panel"
      style={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        background: C.surface,
        borderRadius: L.panelBorderRadius,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        color: C.text,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: L.headerZIndex,
          background: C.surface,
          padding: `${L.panelPadding}px ${L.panelPadding}px 8px`,
          display: "flex",
          flexDirection: "column",
          gap: L.sectionGap,
        }}
      >
        {/* Title + selected count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: L.titleFontSize, fontWeight: L.titleFontWeight, color: C.text, whiteSpace: "nowrap" }}>
            {COMMUNITY_FILTER_MESSAGES.title}
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              aria-label={getSelectedCountAriaLabel(selected.length)}
              style={{
                fontSize: L.countFontSize,
                fontWeight: 500,
                padding: "3px 10px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                background: hasSelection ? C.countActiveBg : C.countIdleBg,
                color: hasSelection ? COMMUNITY_FILTER_ACCENT : C.textMuted,
              }}
            >
              {selected.length} {COMMUNITY_FILTER_MESSAGES.selectedLabel}
            </span>

            {showClose && onClose && (
              <button
                type="button"
                className="cf-close"
                aria-label={COMMUNITY_FILTER_MESSAGES.closeLabel}
                onClick={onClose}
                style={{
                  width: L.closeButtonSize,
                  height: L.closeButtonSize,
                  borderRadius: L.closeButtonRadius,
                  border: "1px solid transparent",
                  background: "transparent",
                  color: C.textMuted,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.icon}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            aria-label={COMMUNITY_FILTER_MESSAGES.searchAriaLabel}
            className="cf-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={COMMUNITY_FILTER_MESSAGES.searchPlaceholder}
            style={{
              width: "100%",
              height: L.searchInputHeight,
              padding: query.trim() ? "0 42px 0 40px" : "0 12px 0 40px",
              borderRadius: L.inputBorderRadius,
              border: `1px solid ${C.controlBorder}`,
              fontFamily: "inherit",
              fontSize: L.searchInputFontSize,
              color: C.text,
              boxSizing: "border-box",
              background: C.surface,
            }}
          />

          {query.trim() && (
            <button
              type="button"
              className="cf-close"
              aria-label={COMMUNITY_FILTER_MESSAGES.clearSearchAriaLabel}
              onClick={clearQuery}
              style={{
                position: "absolute",
                top: "50%",
                right: 6,
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid transparent",
                background: "transparent",
                color: C.textMuted,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>

        {/* Select all / Clear */}
        <div style={{ display: "flex", gap: 20 }}>
          <button
            type="button"
            className="cf-link"
            onClick={selectAllVisible}
            aria-label={getSelectVisibleAriaLabel(filtered.length)}
          >
            {getSelectVisibleLabel(filtered.length)}
          </button>

          <button
            type="button"
            className="cf-link"
            onClick={clearSelection}
            aria-label={COMMUNITY_FILTER_MESSAGES.clearAriaLabel}
          >
            {COMMUNITY_FILTER_MESSAGES.clearLabel}
          </button>
        </div>
      </div>

      <div
        role="listbox"
        aria-label={COMMUNITY_FILTER_MESSAGES.listboxAriaLabel}
        aria-multiselectable="true"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          background: C.surface,
          margin: `0 ${L.panelPadding}px`,
          padding: "6px 0 12px",
          borderTop: `1px solid ${C.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ color: C.emptyStateText, padding: "8px 10px", fontSize: 14 }}>
            {COMMUNITY_FILTER_MESSAGES.emptyState}
          </div>
        ) : (
          filtered.map((c) => {
            const checked = selected.includes(c);

            return (
              <label
                key={c}
                className="cf-row"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(c);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: L.listItemGap,
                  minHeight: L.listItemMinHeight,
                  padding: "6px 10px",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  borderRadius: L.listItemBorderRadius,
                  background: checked ? C.selectedItemBackground : "transparent",
                }}
                aria-checked={checked}
                aria-selected={checked}
                role="option"
                title={c}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(c)}
                  aria-checked={checked}
                  tabIndex={-1}
                  style={{
                    width: L.checkboxSize,
                    height: L.checkboxSize,
                    margin: 0,
                    accentColor: COMMUNITY_FILTER_ACCENT,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    userSelect: "none",
                    fontSize: L.listItemFontSize,
                    lineHeight: 1.3,
                    color: C.text,
                    fontWeight: checked ? 600 : 400,
                    wordBreak: "break-word",
                  }}
                >
                  {c}
                </span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunityFilter;
