// employer-profile-form.tsx

import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSession } from '@/context/SessionContext';
import ErrorMsg from '../common/error-msg';
import { notifySuccess, notifyError } from '@/utils/toast';

type SocialMediaLink = {
  network: string;
};

type EmployerProfileFormData = {
  name: string;
  email: string;
  website: string;
  foundedDate: string;
  companySize: string;
  phoneNumber: string;
  category: string;
  aboutCompany: string;
  socialMediaLinks: SocialMediaLink[];
};

const EmployerProfileForm: React.FC = () => {
  const { session } = useSession();
  const [initialValues, setInitialValues] = useState<EmployerProfileFormData>({
    name: '',
    email: '',
    website: '',
    foundedDate: '',
    companySize: '',
    phoneNumber: '',
    category: '',
    aboutCompany: '',
    socialMediaLinks: [{ network: '' }, { network: '' }]
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/get-employer-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      const data = await response.json();

      if (response.ok && data.employerProfile) {
        setInitialValues((prevValues) => ({
          ...prevValues,
          ...data.employerProfile,
          name: data.employerProfile.name,
          email: data.employerProfile.email,
        }));

        // Handling social media links dynamically
        if (data.employerProfile.socialMediaLinks && Object.keys(data.employerProfile.socialMediaLinks).length > 0) {
          const linksArray = Object.entries(data.employerProfile.socialMediaLinks as Record<string, { network: string }>).map(([index, link]) => ({
            network: link.network,
          }));

          while (linksArray.length < 2) {
            linksArray.push({ network: '' });
          }

          setInitialValues((prevValues) => ({
            ...prevValues,
            socialMediaLinks: linksArray
          }));
        }
      } else {
        // If no data from API, use session data
        setInitialValues((prevValues) => ({
          ...prevValues,
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        }));

      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data');
      // Use session data in case of error
      setInitialValues((prevValues) => ({
        ...prevValues,
        name: session?.user?.name || '',
        email: session?.user?.email || '',
      }));
    }
  };

  if (session?.user?.email) {
    fetchUserProfile();
  }
}, [session]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    website: Yup.string().required('Required'),
    foundedDate: Yup.date().required('Required'),
    companySize: Yup.number().required('Required'),
    phoneNumber: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
    aboutCompany: Yup.string().required('Required')
  });

  const onSubmit = async (values: EmployerProfileFormData) => {
    try {
      // Submit employer profile data
      const employerResponse = await fetch('/api/employer-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!employerResponse.ok) {
        throw new Error('Failed to update employer profile');
      }

      // Submit social media links data
      const formattedLinks = values.socialMediaLinks.reduce((acc, link, index) => {
        if (link.network) {
          acc[index] = { network: link.network };
        }
        return acc;
      }, {} as Record<string, { network: string }>);

      // const socialMediaResponse = await fetch('/api/employer-profile', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',Error fetching user data
      //   },
      //   body: JSON.stringify({ email: values.email, socialMediaLinks: formattedLinks }),
      // });

      // if (!socialMediaResponse.ok) {
      //   const socialMediaData = await socialMediaResponse.json();
      //   setError(socialMediaData.message || 'Error updating social media links');
      //   return;
      // }

      notifySuccess('Details updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      notifyError('Failed to update details');
    }
  };

  return (
    <div className="bg-white card-box border-20 mt-40">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {formik => (
          <Form>
            <h4 className="dash-title-three">Profile</h4>
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
                    readOnly
                    style={{ cursor: 'not-allowed' }}
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
                  <ErrorMessage name="website" component="div" className="error-text" />
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
                  <ErrorMessage name="foundedDate" component="div" className="error-text" />
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
                  <ErrorMessage name="companySize" component="div" className="error-text" />
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
                  <ErrorMessage name="phoneNumber" component="div" className="error-text" />
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
                  <ErrorMessage name="category" component="div" className="error-text" />
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
              <ErrorMessage name="aboutCompany" component="div" className="error-text" />
              <div className="alert-text">
                Brief description for your company. URLs are hyperlinked.
              </div>
            </div>
            <div className="bg-white card-box border-20 mt-40">
              <h4 className="dash-title-three">Social Media</h4>
              {error && <ErrorMsg msg={error} />}
              {formik.values.socialMediaLinks.map((link, index) => (
                <div key={index} className="dash-input-wrapper mb-20">
                  <label htmlFor={`socialMediaLinks.${index}.network`}>Network {index + 1}</label>
                  <Field
                    type="text"
                    id={`socialMediaLinks.${index}.network`}
                    name={`socialMediaLinks.${index}.network`}
                    placeholder={`Enter Network ${index + 1} URL`}
                    className="form-control"
                  />
                  <ErrorMessage name={`socialMediaLinks.${index}.network`} component="div" className="error-text" />
                </div>
              ))}
              <button
                type="button"
                className="dash-btn-one mb-20"
                onClick={() => {
                  formik.setFieldValue('socialMediaLinks', [
                    ...formik.values.socialMediaLinks,
                    { network: '' },
                  ]);
                }}
              >
                <i className="bi bi-plus"></i> Add more link
              </button>
            </div>
            <div className="button-group d-inline-flex align-items-center mt-30">
              <button type="submit" className="dash-btn-two tran3s me-3">
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EmployerProfileForm;



