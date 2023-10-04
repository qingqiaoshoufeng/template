import userSettings from "@/config/settings.js";
export default typeof userSettings === "function" ? userSettings({ env: import.meta.env }) : userSettings;
