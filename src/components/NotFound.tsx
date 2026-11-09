import { Link } from "react-router-dom";
import {
  color_dv_border,
  color_dv_page,
  color_dv_primary,
  color_dv_primary_hover,
  color_dv_text,
  color_dv_text_muted,
} from "../constants/colors";

// Shown for any address the app doesn't recognise. Styled to match the navy design.
const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px 16px",
        boxSizing: "border-box",
        background: color_dv_page,
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          boxSizing: "border-box",
          background: "#FFFFFF",
          border: `1px solid ${color_dv_border}`,
          borderRadius: 12,
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 600, color: color_dv_text }}>
          Page not found
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 15, lineHeight: 1.5, color: color_dv_text_muted }}>
          The page you were looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          to="/files"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 44,
            padding: "0 20px",
            borderRadius: 10,
            background: color_dv_primary,
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = color_dv_primary_hover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = color_dv_primary)}
        >
          Go to Files
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
