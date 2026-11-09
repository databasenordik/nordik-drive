import { NavWrapper } from "../Wrappers";
import { HeaderLink } from "../Links";
import { useSelector } from "react-redux";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Stack, useMediaQuery, useTheme } from "@mui/material";

interface HeaderNavProps {
  onLinkClick?: () => void; // called when a nav link is clicked
}

const iconSx = { fontSize: 18 };

function HeaderNav({ onLinkClick }: HeaderNavProps) {
  const { user } = useSelector((state: any) => state.auth);
  const theme = useTheme();
  // Below md the links only render inside the menu drawer, so stack them there.
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <NavWrapper aria-label="Main">
      <Stack
        direction={isMobile ? "column" : "row"} // vertical on mobile
        spacing={isMobile ? 1 : 0.5}
        alignItems={isMobile ? "stretch" : "center"}
        flexWrap={isMobile ? "nowrap" : "wrap"}
        sx={{ width: isMobile ? "100%" : "auto" }}
        useFlexGap
      >
        <HeaderLink to="/files" onClick={onLinkClick}>
          <FolderOutlinedIcon sx={iconSx} aria-hidden="true" />
          Files
        </HeaderLink>

        {user?.role === "Admin" && (
          <HeaderLink to="/adminpanel" onClick={onLinkClick}>
            <AdminPanelSettingsOutlinedIcon sx={iconSx} aria-hidden="true" />
            Admin view
          </HeaderLink>
        )}

        {user?.role === "Admin" && (
          <HeaderLink to="/useractivity" onClick={onLinkClick}>
            <ScheduleOutlinedIcon sx={iconSx} aria-hidden="true" />
            User activity
          </HeaderLink>
        )}

        {user?.role === "User" && (
          <HeaderLink to="/contact-us" onClick={onLinkClick}>
            <PhoneOutlinedIcon sx={iconSx} aria-hidden="true" />
            Contact us
          </HeaderLink>
        )}
        {user?.role === "User" && (
          <HeaderLink to="/acknowledgement" onClick={onLinkClick}>
            <TaskAltOutlinedIcon sx={iconSx} aria-hidden="true" />
            Acknowledgement
          </HeaderLink>
        )}

        <HeaderLink to="/requests" onClick={onLinkClick}>
          <AssignmentOutlinedIcon sx={iconSx} aria-hidden="true" />
          Requests
        </HeaderLink>
      </Stack>
    </NavWrapper>
  );
}

export default HeaderNav;
