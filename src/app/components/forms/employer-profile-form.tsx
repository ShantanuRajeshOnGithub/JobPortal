"use client";
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSession } from '@/context/SessionContext';
import { notifySuccess,notifyError } from '@/utils/toast';

const EmployerProfileForm = () => {
  const { session } = useSession();
  const [initialValues, setInitialValues] = useState({
      name: '',
      email: '',
      website: '',
      foundedDate: '',
      companySize: '',
      phoneNumber: '',
      category: '',
      aboutCompany: ''
  });

  useEffect(() => {
      
      const fetchEmployerProfile = async () => {
          try {
              if (session?.user?.email) {
                  const response = await fetch('/api/get-employer-details', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email: session.user.email }),
                  });

                  if (!response.ok) {
                      throw new Error('Failed to fetch employer profile');
                  }

                  const data = await response.json();
                  setInitialValues({
                      ...initialValues,
                      ...data.employerProfile 
                  });
              }
          } catch (error) {
              console.error('Error fetching employer profile:', error);
              
          }
      };

      if (session?.user?.email) {
          fetchEmployerProfile();
      }
  }, [session]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    website: Yup.string().url('Invalid URL format').required('Required'),
    foundedDate: Yup.date().required('Required'),
    companySize: Yup.number().required('Required'),
    phoneNumber: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
    aboutCompany: Yup.string().required('Required')
  });

  const onSubmit = async (values: any) => {
    console.log('Form data', values);
    try {
      const response = await fetch('/api/employer-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const result = await response.json();
      console.log('Success:', result);
      notifySuccess('Details updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      notifyError('Failed to update details');

    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {formik => (
        <Form>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="name">Name*</label>
            <Field
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              className="form-control"
            />
            <ErrorMessage name="name" component="div" className="error-text" />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="email">Email*</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="companyinc@gmail.com"
                  className="form-control"
                  readOnly // Make the field read-only
                  style={{ cursor: 'not-allowed' }} // Change cursor style
/>
                <ErrorMessage name="email" component="div" className="error-text" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="website">Website*</label>
                <Field
                  type="text"
                  id="website"
                  name="website"
                  placeholder="http://somename.com"
                  className="form-control"
                />
                <ErrorMessage
                  name="website"
                  component="div"
                  className="error-text"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="foundedDate">Founded Date*</label>
                <Field
                  type="date"
                  id="foundedDate"
                  name="foundedDate"
                  className="form-control"
                />
                <ErrorMessage
                  name="foundedDate"
                  component="div"
                  className="error-text"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="companySize">Company Size*</label>
                <Field
                  type="text"
                  id="companySize"
                  name="companySize"
                  placeholder="700"
                  className="form-control"
                />
                <ErrorMessage
                  name="companySize"
                  component="div"
                  className="error-text"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="phoneNumber">Phone Number*</label>
                <Field
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+880 01723801729"
                  className="form-control"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="error-text"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="category">Category*</label>
                <Field
                  type="text"
                  id="category"
                  name="category"
                  placeholder="Account, Finance, Marketing"
                  className="form-control"
                />
                <ErrorMessage
                  name="category"
                  component="div"
                  className="error-text"
                />
              </div>
            </div>
          </div>
          <div className="dash-input-wrapper">
            <label htmlFor="aboutCompany">About Company*</label>
            <Field
              as="textarea"
              id="aboutCompany"
              name="aboutCompany"
              placeholder="Write something interesting about you...."
              className="size-lg form-control"
            />
            <ErrorMessage
              name="aboutCompany"
              component="div"
              className="error-text"
            />
            <div className="alert-text">
              Brief description for your company. URLs are hyperlinked.
            </div>
          </div>
          <div className="button-group d-inline-flex align-items-center mt-30">
            <button type="submit" className="dash-btn-two tran3s me-3">
              Save
            </button>
            <button type="reset" className="dash-cancel-btn tran3s">
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmployerProfileForm;
