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
//   newPassword: string;
//   confirmNewPassword: string;
// };
// type IFormDataNew ={
//     password: string;
//     token:string
// }


// // Schema
// const schema = Yup.object().shape({
//   newPassword: Yup.string().required("New Password is required").min(6, "New Password must be at least 6 characters long").label("New Password"),
//   confirmNewPassword: Yup.string()
//     .oneOf([Yup.ref('newPassword') as unknown as string | undefined], 'Passwords must match')
//     .required("Confirm New Password is required")
//     .label("Confirm New Password"),
// });

// // Resolver
// const resolver: Resolver<IFormData> = async (values) => {
//   const errors: any = {};
//   if (!values.newPassword) {
//     errors.newPassword = {
//       type: "required",
//       message: "New Password is required.",
//     };
//   }
//   if (!values.confirmNewPassword) {
//     errors.confirmNewPassword = {
//       type: "required",
//       message: "Confirm New Password is required.",
//     };
//   } else if (values.newPassword !== values.confirmNewPassword) {
//     errors.confirmNewPassword = {
//       type: "oneOf",
//       message: "Passwords must match.",
//     };
//   }

//   return {
//     values: values.newPassword && values.confirmNewPassword ? values : {},
//     errors,
//   };
// };

// const ResetPasswordForm: React.FC = () => {
//   const { fetchWithSession } = useSession();
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<IFormData>({
//     resolver,
//   });

//   // On submit
//   const onSubmit = async (data: IFormData) => {
//     try {
//       const response = await fetchWithSession("/api/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (response.status === 200) {
//         reset();
//         alert("Password has been reset successfully");
//         router.push("/login");
//       } else if (response.status === 400) {
//         log.error("Bad request error response from server:", response);
//       } else {
//         log.error("Error response from server:", response);
//       }
//     } catch (error) {
//       log.error("Error during password reset:", error);
//       alert("An unexpected error occurred");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="row">
//         <div className="col-12">
//           <div className="input-group-meta position-relative mb-25">
//             <label>New Password*</label>
//             <input
//               type="password"
//               placeholder="Enter your new password"
//               {...register("newPassword")}
//             />
//             <div className="help-block with-errors">
//               <ErrorMsg msg={errors.newPassword?.message!} />
//             </div>
//           </div>
//         </div>
//         <div className="col-12">
//           <div className="input-group-meta position-relative mb-25">
//             <label>Confirm New Password*</label>
//             <input
//               type="password"
//               placeholder="Confirm your new password"
//               {...register("confirmNewPassword")}
//             />
//             <div className="help-block with-errors">
//               <ErrorMsg msg={errors.confirmNewPassword?.message!} />
//             </div>
//           </div>
//         </div>
//         <div className="col-12">
//           <button
//             type="submit"
//             className="btn-eleven fw-500 tran3s d-block mt-20"
//           >
//             Reset Password
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default ResetPasswordForm;
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import log from "@/utils/clientLogger";
import ErrorMsg from "../common/error-msg";

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
  const token = searchParams.get("token"); // Retrieve token from query parameters

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

    try {
      // Create payload with the new password and token
      const requestData: IFormDataNew = {
        password: data.newPassword,
        token, // Include the token in the payload
      };

      const response = await fetchWithSession("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // Send new password and token
      });

      if (response.status === 200) {
        reset();
        alert("Password has been reset successfully");
        router.push("/login");
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
            className="btn-eleven fw-500 tran3s d-block mt-20"
          >
            Reset Password
          </button>
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
