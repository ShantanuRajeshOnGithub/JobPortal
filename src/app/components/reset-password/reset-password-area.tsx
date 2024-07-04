"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import log from "@/utils/clientLogger";
import ResetPasswordForm from "../forms/reset-password-form";

const ResetPasswordArea: React.FC = () => {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    log.debug("Checking session in ResetPasswordArea:", session);
    if (session) {
      log.info("Session exists, redirecting to home");
      router.push("/"); // Redirect to home if session exists
    }
  }, [session, router]);

  // If session exists, avoid rendering the component during the redirect
  if (session) {
    return null;
  }

  return (
    <section className="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
      <div className="container">
        <div className="user-data-form">
          <div className="text-center">
            <h2>Reset Password</h2>
          </div>
          <div className="form-wrapper m-auto">
            <div className="tab-content mt-40">
              <div
                className="tab-pane fade show active"
                role="tabpanel"
                id="fc1"
              >
                <ResetPasswordForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordArea;
