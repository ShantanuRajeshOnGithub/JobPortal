import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import ResetPasswordArea from "../components/reset-password/reset-password-area";

export const metadata: Metadata = {
  title: "Reset Password",
};

const ForgetPasswordPage = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <Header />
        {/* header end */}

        {/*breadcrumb start */}
        <CompanyBreadcrumb
          title="Reset Password"
          subtitle=""
        />
        {/*breadcrumb end */}

        {/* register area start */}
        <ResetPasswordArea />
        {/* register area end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default ForgetPasswordPage;
