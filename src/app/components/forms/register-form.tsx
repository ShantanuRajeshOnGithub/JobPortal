"use client";

import React, { useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import ErrorMsg from "../common/error-msg";
import icon from "@/assets/images/icon/icon_60.svg";
import { useSession } from "@/context/SessionContext";
import log from "@/utils/clientLogger";
import { notifyError,notifySuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";

// form data type
type IFormData = {
  name: string;
  email: string;
  password: string;
  accountType: string;
  acceptedTerms: boolean;
};

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  acceptedTerms: Yup.boolean()
    .oneOf([true], "Terms and conditions must be accepted")
    .required(),
});

// resolver
const resolver: Resolver<IFormData> = async (values) => {
  const errors: any = {};
  if (!values.name) {
    errors.name = {
      type: "required",
      message: "Name is required.",
    };
  }
  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email is required.",
    };
  }
  if (!values.password) {
    errors.password = {
      type: "required",
      message: "Password is required.",
    };
  }
  if (!values.acceptedTerms) {
    errors.acceptedTerms = {
      type: "required",
      message: "Terms and conditions must be accepted.",
    };
  }

  return {
    values: values.name ? values : {},
    errors,
  };
};

interface RegisterFormProps {
  accountType: "candidate" | "employer";
}

const RegisterForm: React.FC<RegisterFormProps> = ({ accountType }) => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const { fetchWithSession } = useSession();
  const router = useRouter();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>({
    resolver,
    defaultValues: {
      accountType,
      name: "",
      email: "",
      password: "",
      acceptedTerms: false,
    },
  });

  // on submit
  
  const onSubmit = async (data: IFormData) => {
    try {
      const response = await fetchWithSession("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        reset();
        notifySuccess("Registration successful!"); // Show success toast
        router.push("/login");
      } 
       else {
        
        log.error("Error response from server:", responseData);
        notifyError("An unexpected error occurred"); // Show error toast
      }
    } catch (error) {
      log.error("Error during registration:", error);
      notifyError("An unexpected error occurred"); // Show error toast
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Name*</label>
            <input
              type="text"
              placeholder="James Brower"
              {...register("name")}
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.name?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input
              type="email"
              placeholder="james@example.com"
              {...register("email")}
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
              {...register("password")}
            />
            <span
              className="placeholder_icon"
              onClick={() => setShowPass(!showPass)}
            >
              <span className={`passVicon ${showPass ? "eye-slash" : ""}`}>
                <Image src={icon} alt="pass-icon" />
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
              <input
                type="checkbox"
                id={`acceptedTerms-${accountType}`}
                {...register("acceptedTerms")}
              />
              <label htmlFor={`acceptedTerms-${accountType}`}>
                By hitting the Register button, you agree to the{" "}
                <a href="#">Terms conditions</a> &{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.acceptedTerms?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn-eleven fw-500 tran3s d-block mt-20"
          >
            Register
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
