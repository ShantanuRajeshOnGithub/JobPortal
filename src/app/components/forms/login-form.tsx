"use client";
import React, { useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import ErrorMsg from "../common/error-msg";
import icon from "@/assets/images/icon/icon_60.svg";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import log from "@/utils/clientLogger";

// form data type
type IFormData = {
  email: string;
  password: string;
};

// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

// resolver
const resolver: Resolver<IFormData> = async (values) => {
  return {
    values: values.email ? values : {},
    errors: !values.email
      ? {
          email: {
            type: "required",
            message: "Email is required.",
          },
          password: {
            type: "required",
            message: "Password is required.",
          },
        }
      : {},
  };
};

const LoginForm = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const router = useRouter();
  const { session, updateSession } = useSession();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<IFormData>({ resolver });

const onSubmit = async (data: IFormData) => {
  const { email, password } = data;
  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  
  log.debug("result:", result);
  
  if (result?.error) {
    setError(result.error);
  } else if (result?.ok) {
    setError(null);
    await updateSession(); 

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { accountType } = responseData;

        log.debug("accountType:", accountType);

        // Redirect based on accountType
        if (accountType === "candidate") {
          router.push("/dashboard/candidate-dashboard");
        } else if (accountType === "employer") {
          router.push("/dashboard/employ-dashboard");
        } else {
          setError("Unexpected account type");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error fetching account type");
      }
    } catch (error) {
      setError("Error fetching account type");
      console.error(error);
    }
  } else {
    setError("Unexpected error occurred");
  }

  reset(); // Reset form fields after submission
};

  // Handle Forget Password click
  const handleForgetPassword = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const email = getValues("email");
    const url = email ? `/forgetPassword?e=${email}` : "/forgetPassword";
    router.push(url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input
              type="email"
              placeholder="james@example.com"
              {...register("email", { required: `Email is required!` })}
              name="email"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.email?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-20">
            <label>Password*</label>
            <input
              type={`${showPass ? "text" : "password"}`}
              placeholder="Enter Password"
              className="pass_log_id"
              {...register("password", { required: `Password is required!` })}
              name="password"
            />
            <span
              className="placeholder_icon"
              onClick={() => setShowPass(!showPass)}
            >
              <span className={`passVicon ${showPass ? "eye-slash" : ""}`}>
                <Image src={icon} alt="icon" />
              </span>
            </span>
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.password?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="agreement-checkbox d-flex justify-content-between align-items-center">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Keep me logged in</label>
            </div>
            <a href="#" onClick={handleForgetPassword}>Forget Password?</a>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn-eleven fw-500 tran3s d-block mt-20"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;