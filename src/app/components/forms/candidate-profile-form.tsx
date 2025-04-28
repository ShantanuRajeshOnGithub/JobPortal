"use client";

import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSession } from "@/context/SessionContext";
import ErrorMsg from "../common/error-msg";
import { notifySuccess, notifyError } from "@/utils/toast";

type SocialMediaLink = {
  network: string;
};

type CandidateProfileFormData = {
  name: string;
  email: string;
  bio: string;
  phoneNumber: string;
  socialMediaLinks: SocialMediaLink[];
};

const CandidateProfileForm: React.FC = () => {
  const { session } = useSession();
  const [initialValues, setInitialValues] = useState<CandidateProfileFormData>({
    name: "",
    email: "",
    bio: "",
    phoneNumber: "",
    socialMediaLinks: [{ network: "" }, { network: "" }],
  });

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/get-user-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session?.user?.email }),
        });
        const data = await response.json();
        if (response.ok && data.candidateProfile) {
          setInitialValues((prev) => ({
            ...prev,
            ...data.candidateProfile,
          }));
        }
      } catch (err) {
        console.error("Error fetching candidate data:", err);
        setError("Error fetching candidate data");
      }
    };

    if (session?.user?.email) fetchProfile();
  }, [session]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    bio: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
  });

  const onSubmit = async (values: CandidateProfileFormData) => {
    setIsSaving(true);
    try {
      const filteredValues = {
        ...values,
        socialMediaLinks: values.socialMediaLinks.filter(
          (link) => link.network.trim() !== ""
        ),
      };

      const res = await fetch("/api/candidate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredValues),
      });

      if (!res.ok) throw new Error("Failed to update candidate profile");
      notifySuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Error:", err);
      notifyError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white card-box border-20 mt-40">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <h4 className="dash-title-three">Candidate Profile</h4>

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="name">Full Name*</label>
              <Field name="name" className="form-control" placeholder="John Doe" />
              <ErrorMessage name="name" component="div" className="error-text" />
            </div>

            <div className="dash-input-wrapper mb-30">
  <label htmlFor="email">Email*</label>
  <Field
    type="email"
    id="email"
    name="email"
    placeholder="yourmail@example.com"
    className="form-control"
    readOnly
    style={{ cursor: "not-allowed" }}
  />
  <ErrorMessage name="email" component="div" className="error-text" />
</div>


            <div className="dash-input-wrapper mb-30">
              <label htmlFor="phoneNumber">Phone Number*</label>
              <Field
                name="phoneNumber"
                type="tel"
                className="form-control"
                placeholder="+91 9876543210"
              />
              <ErrorMessage name="phoneNumber" component="div" className="error-text" />
            </div>

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="bio">Bio*</label>
              <Field
                as="textarea"
                name="bio"
                className="form-control size-lg"
                placeholder="Tell us about yourself..."
              />
              <ErrorMessage name="bio" component="div" className="error-text" />
            </div>

            <div className="bg-white card-box border-20 mt-40">
              <h4 className="dash-title-three">Social Media</h4>
              {error && <ErrorMsg msg={error} />}
              {formik.values.socialMediaLinks.map((link, index) => (
                <div key={index} className="dash-input-wrapper mb-20">
                  <label>Network {index + 1}</label>
                  <Field
                    name={`socialMediaLinks.${index}.network`}
                    placeholder={`Enter Network ${index + 1} URL`}
                    className="form-control"
                  />
                </div>
              ))}

              {/* ⬇️ Fix for "Add More Link" button */}
              <button
                type="button"
                className="dash-btn-one mb-20"
                onClick={() => {
                  formik.setFieldValue("socialMediaLinks", [
                    ...formik.values.socialMediaLinks,
                    { network: "" },
                  ]);
                }}
              >
                <i className="bi bi-plus"></i> Add more link
              </button>
            </div>

            {/* Save Button */}
            <div className="button-group d-inline-flex align-items-center mt-30">
              <button
                type="submit"
                className="dash-btn-two tran3s me-3"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CandidateProfileForm;
