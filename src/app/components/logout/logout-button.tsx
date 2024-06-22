import React from "react";
import { signOut } from "next-auth/react";
import log from "@/utils/clientLogger";

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      log.debug("User logged out successfully");
      // Optionally, you can add a custom redirect after logout
      window.location.href = "/login"; // Redirect to login page or any other page
    } catch (error) {
      log.error("Error during logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="btn-eleven fw-500 tran3s d-block mt-20"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
