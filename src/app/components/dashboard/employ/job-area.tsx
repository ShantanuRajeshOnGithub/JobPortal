"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "../candidate/dashboard-header";
import EmployShortSelect from "./short-select";
import { format } from "date-fns";

// Props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

// JobPost type definition based on MongoDB structure
type JobPost = {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  jobCategory: string;
  jobType: string;
  salaryMin: string;
  salaryMax: string;
  skills: string;
  experience?: string;
  location?: string;
  industry?: string;
  fileAttachment?: string;
  createdAt: string;
};

const EmployJobArea = ({ setIsOpenSidebar }: IProps) => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/get-jobs");
        const data = await response.json();
        if (Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          console.error("Invalid jobs format:", data.jobs);
          setJobs([]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">My Jobs</h2>
          <div className="d-flex ms-auto xs-mt-30">
            <div className="nav nav-tabs tab-filter-btn me-4" id="nav-tab" role="tablist">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#a1"
                type="button"
                role="tab"
                aria-selected="true"
              >
                All
              </button>
            </div>
            <div className="short-filter d-flex align-items-center ms-auto">
              <div className="text-dark fw-500 me-2">Short by:</div>
              <EmployShortSelect />
            </div>
          </div>
        </div>

        <div className="bg-white card-box border-20">
          {loading ? (
            <p className="p-4">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="p-4">No jobs found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table job-alert-table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Job Created</th>
                    <th scope="col">Applicants</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <strong>{job.jobTitle}</strong>
                        <div className="text-muted small">
                          {job.jobType} · {job.location || "N/A"}
                        </div>
                      </td>
                      <td>
                        {job.createdAt
                          ? format(new Date(job.createdAt), "dd MMM, yyyy")
                          : "N/A"}
                      </td>
                      <td>{Math.floor(Math.random() * 50 + 5)} applicants</td>
                      <td>
                        <span className="badge bg-success">Active</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedJob(job)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Job Details Section */}
        {selectedJob && (
          <div className="bg-light border p-4 rounded mt-4 shadow">
            <h5 className="mb-3">{selectedJob.jobTitle}</h5>
            <p><strong>Description:</strong> {selectedJob.jobDescription}</p>
            <p><strong>Category:</strong> {selectedJob.jobCategory}</p>
            <p><strong>Type:</strong> {selectedJob.jobType}</p>
            <p><strong>Salary:</strong> ₹{selectedJob.salaryMin} – ₹{selectedJob.salaryMax}</p>
            <p><strong>Skills:</strong> {selectedJob.skills}</p>
            {selectedJob.location && <p><strong>Location:</strong> {selectedJob.location}</p>}
            {selectedJob.experience && <p><strong>Experience:</strong> {selectedJob.experience}</p>}
            {selectedJob.industry && <p><strong>Industry:</strong> {selectedJob.industry}</p>}
            <button
              className="btn btn-sm btn-danger mt-3"
              onClick={() => setSelectedJob(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployJobArea;
