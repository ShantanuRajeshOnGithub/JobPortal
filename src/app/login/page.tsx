import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import LoginArea from "../components/login/login-area";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <Header />
        {/* header end */}

        {/*breadcrumb start */}
        <CompanyBreadcrumb title="Login" subtitle="Login to your account" />
        {/*breadcrumb end */}

        {/* Login area start */}
        <LoginArea />
        {/* Login area end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default LoginPage;
