
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import log from "@/utils/clientLogger";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";

// Form data type
type IFormData = {
  newPassword: string;
  confirmNewPassword: string;
};

type IFormDataNew = {
  password: string;
  token: string;
};

// Schema
const schema = Yup.object().shape({
  newPassword: Yup.string()
    .required("New Password is required")
    .min(6, "New Password must be at least 6 characters long")
    .label("New Password"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm New Password is required")
    .label("Confirm New Password"),
});

const ResetPasswordForm: React.FC = () => {
  const { fetchWithSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>({
    resolver: yupResolver(schema),
  });

  // On submit
  const onSubmit = async (data: IFormData) => {
    if (!token) {
      alert("Token is missing. Please check the reset password link.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const requestData: IFormDataNew = {
        password: data.newPassword,
        token,
      };

      const response = await fetchWithSession("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        reset();
        const mes = "Password has been reset successfully";
        notifySuccess(mes);
        router.push("/login");
      } else if (response.status === 400) {
        log.error("Bad request error response from server:", response);
        const mes = "Error during password reset";
        notifyError(mes);
      } else {
        log.error("Error response from server:", response);
        const mes = "Error during password reset";
        notifyError(mes);
      }
    } catch (error) {
      log.error("Error during password reset:", error);
      const mes = "Error during password reset";
      notifyError(mes);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>New Password*</label>
            <input
              type="password"
              placeholder="Enter your new password"
              {...register("newPassword")}
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.newPassword?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Confirm New Password*</label>
            <input
              type="password"
              placeholder="Confirm your new password"
              {...register("confirmNewPassword")}
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.confirmNewPassword?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className={`btn-eleven fw-500 tran3s d-block mt-20 ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-animation">Processing...</div>
            ) : (
              "Reset Password"
            )}
          </button>
          <br></br><br></br>
        </div>
      </div>
      <style jsx>{`
        .loading-animation {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-eleven.loading {
          background: #ccc;
          cursor: not-allowed;
        }
        .btn-eleven.loading::after {
          content: "";
          width: 20px;
          height: 20px;
          border: 2px solid #fff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-left: 10px;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </form>
  );
};

export default ResetPasswordForm;