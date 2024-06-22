"use client";

import React, { useEffect, useState } from "react";
import log from "@/utils/clientLogger";
import Link from "next/link";
import LoginForm from "@/app/components/forms/login-form";
import Image from "next/image";
import google from "@/assets/images/icon/google.png";
import facebook from "@/assets/images/icon/facebook.png";
import withAuthRedirect from "@/utils/withAuthRedirect";

const ProtectedLoginForm = withAuthRedirect(LoginForm);

export default function LoginArea() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    log.log("LoginPage component mounted on client");
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Ensure the component only renders on the client
  }

  return (
    <div className="login-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
      <div className="container">
        <div className="user-data-form">
          <div className="text-center">
            <h2>Hi, Welcome Back!</h2>
            <p>
              Still do not have an account?{" "}
              <Link href="/register">Sign up</Link>
            </p>
          </div>
          <div className="form-wrapper m-auto">
            <ProtectedLoginForm />
            <div className="d-flex align-items-center mt-30 mb-10">
              <div className="line"></div>
              <span className="pe-3 ps-3">OR</span>
              <div className="line"></div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <a
                  href="#"
                  className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                >
                  <Image src={google} alt="google-img" />
                  <span className="ps-2">Login with Google</span>
                </a>
              </div>
              <div className="col-md-6">
                <a
                  href="#"
                  className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                >
                  <Image src={facebook} alt="facebook-img" />
                  <span className="ps-2">Login with Facebook</span>
                </a>
              </div>
            </div>
            <p className="text-center mt-10">
              Do not have an account?{" "}
              <Link href="/register" className="fw-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
