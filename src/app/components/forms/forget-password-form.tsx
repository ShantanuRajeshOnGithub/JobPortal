
"use client";

import React, { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import log from "@/utils/clientLogger";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";

// Form data type
type IFormData = {
  email: string;
};

// Schema
const schema = Yup.object().shape({
  email: Yup.string().required("Email is required.").email("Invalid email format."),
});

// Resolver
const resolver: Resolver<IFormData> = yupResolver(schema);

const ForgetPasswordForm: React.FC = () => {
  const { fetchWithSession } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IFormData>({
    resolver,
    defaultValues: {
      email: "", // Default email
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("e");
    if (email) {
      setValue("email", email);
    }
  }, [setValue]);

  // On submit
  const onSubmit = async (data: IFormData) => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetchWithSession("/api/forgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        reset();
        const mes = "Reset link sent to your registered email";
        notifySuccess(mes);
      } else if (response.status === 400) {
        log.error("Bad request error response from server:", response);
      } else {
        log.error("Error response from server:", response);
      }
    } catch (error) {
      const mes = "Error during password reset";
      notifyError(mes);
      log.error("Error during password reset:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.email?.message!} />
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
              "Send Reset Link"
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

export default ForgetPasswordForm;
