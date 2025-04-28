"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import NiceSelect from "@/ui/nice-select";

const jobCategories = [
  { value: "Designer", label: "Designer" },
  { value: "It & Development", label: "It & Development" },
  { value: "Web & Mobile Dev", label: "Web & Mobile Dev" },
  { value: "Writing", label: "Writing" },
];

const jobTypes = [
  { value: "Full time", label: "Full time" },
  { value: "Part time", label: "Part time" },
  { value: "Hourly-Contract", label: "Hourly-Contract" },
  { value: "Fixed-Price", label: "Fixed-Price" },
];

const salaryTypes = [
  { value: "Monthly", label: "Monthly" },
  { value: "Weekly", label: "Weekly" },
];

const initialValues = {
  jobTitle: "",
  jobDescription: "",
  jobCategory: jobCategories[0].value,
  jobType: jobTypes[0].value,
  salaryType: salaryTypes[0].value,
  salaryMin: "",
  salaryMax: "",
  skills: "",
  file: null,
};

const validationSchema = Yup.object({
  jobTitle: Yup.string().required("Required"),
  jobDescription: Yup.string().required("Required"),
  salaryMin: Yup.string().required("Required"),
  salaryMax: Yup.string().required("Required"),
  skills: Yup.string().required("Required"),
});

const SubmitJobForm = () => {
  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      const formData = {
        jobTitle: values.jobTitle,
        jobDescription: values.jobDescription,
        jobCategory: values.jobCategory,
        jobType: values.jobType,
        salaryMin: values.salaryMin,
        salaryMax: values.salaryMax,
        skills: values.skills,
        industry: "",
        location: "",
        experience: "",
        fileAttachment: "",
      };

    const response = await fetch("/api/post-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Job posted successfully!");
      resetForm();
    } else {
      alert(data.message || "Something went wrong.");
    }
  } catch (error) {
    console.error("Error posting job:", error);
    alert("Failed to post job.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit} // <-- pass the updated async handler here
>
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="bg-white card-box border-20 p-4">
          <h4 className="dash-title-three">Job Details</h4>

          <div className="dash-input-wrapper mb-30">
            <label>Job Title*</label>
            <Field name="jobTitle" placeholder="Ex: Product Designer" className="form-control" />
            {touched.jobTitle && errors.jobTitle && <div className="text-danger">{errors.jobTitle}</div>}
          </div>

          <div className="dash-input-wrapper mb-30">
            <label>Job Description*</label>
            <Field as="textarea" name="jobDescription" placeholder="Write about the job in details..." className="form-control size-lg" />
            {touched.jobDescription && errors.jobDescription && <div className="text-danger">{errors.jobDescription}</div>}
          </div>

          <div className="row align-items-end">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Job Category</label>
                <NiceSelect
                  options={jobCategories}
                  defaultCurrent={0}
                  onChange={(item) => setFieldValue("jobCategory", item.value)}
                  name="jobCategory"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Job Type</label>
                <NiceSelect
                  options={jobTypes}
                  defaultCurrent={0}
                  onChange={(item) => setFieldValue("jobType", item.value)}
                  name="jobType"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Salary*</label>
                <NiceSelect
                  options={salaryTypes}
                  defaultCurrent={0}
                  onChange={(item) => setFieldValue("salaryType", item.value)}
                  name="salaryType"
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="dash-input-wrapper mb-30">
                <Field name="salaryMin" placeholder="Min" className="form-control" />
                {touched.salaryMin && errors.salaryMin && <div className="text-danger">{errors.salaryMin}</div>}
              </div>
            </div>

            <div className="col-md-3">
              <div className="dash-input-wrapper mb-30">
                <Field name="salaryMax" placeholder="Max" className="form-control" />
                {touched.salaryMax && errors.salaryMax && <div className="text-danger">{errors.salaryMax}</div>}
              </div>
            </div>
          </div>

          <h4 className="dash-title-three pt-50 lg-pt-30">Skills & Experience</h4>

          <div className="dash-input-wrapper mb-30">
            <label>Skills*</label>
            <Field name="skills" placeholder="Add Skills" className="form-control" />
            {touched.skills && errors.skills && <div className="text-danger">{errors.skills}</div>}
            <div className="skill-input-data d-flex align-items-center flex-wrap mt-3">
              {[
                "Design", "UI", "Digital", "Graphics", "Developer", "Product",
                "Microsoft", "Brand", "Photoshop", "Business", "IT & Technology",
                "Marketing", "Article", "Engineer", "HTML5", "Figma", "Automobile", "Account"
              ].map(skill => (
                <button type="button" key={skill} className="me-2 mb-2">{skill}</button>
              ))}
            </div>
          </div>

          <h4 className="dash-title-three pt-50 lg-pt-30">File Attachment</h4>

          <div className="dash-input-wrapper mb-20">
            <label>File Attachment*</label>
            <div className="attached-file d-flex align-items-center justify-content-between mb-15">
              <span>guidline&requirments.doc</span>
              <a href="#" className="remove-btn"><i className="bi bi-x"></i></a>
            </div>
            <div className="dash-btn-one d-inline-block position-relative me-3">
              <i className="bi bi-plus"></i> Upload File
              <input
                type="file"
                name="file"
                onChange={(e) => setFieldValue("file", e.currentTarget.files?.[0])}
                className="position-absolute top-0 start-0 opacity-0 w-100 h-100"
              />
            </div>
            <small>Upload file .pdf, .doc, .docx</small>
          </div>

          <button type="submit" className="dash-btn-two tran3s mt-4">
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default SubmitJobForm;
