// "use client";

// import React from "react";
// import { useForm, Resolver } from "react-hook-form";
// import * as Yup from "yup";
// import { useRouter } from "next/navigation";
// import { useSession } from "@/context/SessionContext";
// import log from "@/utils/clientLogger";
// import ErrorMsg from "../common/error-msg";

// // Form data type
// type IFormData = {
//   email: string;
// };

// // Schema
// const schema = Yup.object().shape({
//   email: Yup.string().required().email().label("Email"),
// });

// // Resolver
// const resolver: Resolver<IFormData> = async (values) => {
//   const errors: any = {};
//   if (!values.email) {
//     errors.email = {
//       type: "required",
//       message: "Email is required.",
//     };
//   }

//   return {
//     values: values.email ? values : {},
//     errors,
//   };
// };

// const ForgetPasswordForm: React.FC = () => {
//   const { fetchWithSession } = useSession();
//   const router = useRouter();
//   const searchParams = new URLSearchParams(window.location.search);
//   const email = searchParams.get("email") || ""; // Get email from query param

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<IFormData>({
//     resolver,
//     defaultValues: {
//       email, // Default email from query param
//     },
//   });

//   // On submit
//   const onSubmit = async (data: IFormData) => {
//     try {
//       const response = await fetchWithSession("/api/forgetPassword", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (response.status === 200) {
//         reset();
//         alert("Reset link sent to your email");
//       } else if (response.status === 400) {
//         log.error("Bad request error response from server:", response);
//       } else {
//         log.error("Error response from server:", response);
//       }
//     } catch (error) {
//       log.error("Error during password reset:", error);
//       alert("User not found");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="row">
//         <div className="col-12">
//           <div className="input-group-meta position-relative mb-25">
//             <label>Email*</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               {...register("email")}
//             />
//             <div className="help-block with-errors">
//               <ErrorMsg msg={errors.email?.message!} />
//             </div>
//           </div>
//         </div>
//         <div className="col-12">
//           <button
//             type="submit"
//             className="btn-eleven fw-500 tran3s d-block mt-20"
//           >
//             Send Reset Link
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default ForgetPasswordForm;

"use client";

import React, { useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"; // Import Yup resolver
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import log from "@/utils/clientLogger";
import ErrorMsg from "../common/error-msg";

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
        alert("Reset link sent to your registered email");
      } else if (response.status === 400) {
        log.error("Bad request error response from server:", response);
      } else {
        log.error("Error response from server:", response);
      }
    } catch (error) {
      log.error("Error during password reset:", error);
      alert("An unexpected error occurred");
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
            className="btn-eleven fw-500 tran3s d-block mt-20"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </form>
  );
};

export default ForgetPasswordForm;
