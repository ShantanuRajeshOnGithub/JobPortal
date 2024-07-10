"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSession } from "@/context/SessionContext";
import ErrorMsg from "../common/error-msg";

type SocialMediaLink = {
  network: string;
};

type SocialMediaLinksFormData = {
  socialMediaLinks: SocialMediaLink[];
};

const SocialMediaLinksForm: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<SocialMediaLinksFormData>({
    defaultValues: {
      socialMediaLinks: [{ network: "" }, { network: "" }] // Ensure at least two fields
    }
  });
  const { fields, append } = useFieldArray({
    control,
    name: "socialMediaLinks"
  });
  const { session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/get-user-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session?.user?.email }),
        });
        const data = await response.json();
  
        if (response.ok) {
          setUserEmail(data.email);
          if (data.socialMediaLinks && Object.keys(data.socialMediaLinks).length > 0) {
            const linksArray = Object.entries(data.socialMediaLinks as Record<string, { network: string }>).map(([index, link]) => ({
              network: link.network,
            }));
  
            // Ensure at least two fields
            while (linksArray.length < 2) {
              linksArray.push({ network: "" });
            }
  
            reset({ socialMediaLinks: linksArray });
          } else {
            // If no socialMediaLinks data, ensure at least two fields
            reset({ socialMediaLinks: [{ network: "" }, { network: "" }] });
          }
        } else {
          setError(data.message || "Error fetching user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data");
      }
    };
  
    if (session?.user?.email) {
      fetchUserProfile();
    }
  }, [reset, session]);

  const onSubmit = async (data: SocialMediaLinksFormData) => {
  try {
    const formattedLinks = data.socialMediaLinks.reduce((acc, link, index) => {
      if (link.network) {
        acc[index] = { network: link.network };
      }
      return acc;
    }, {} as Record<string, { network: string }>);

    const response = await fetch('/api/socialmedialinks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail, socialMediaLinks: formattedLinks }),
    });

    if (response.ok) {
      // Optionally show success message
    } else {
      const responseData = await response.json();
      setError(responseData.message || "Error updating social media links");
    }
  } catch (error) {
    console.error("Error updating social media links:", error);
    setError("Error updating social media links");
  }
};

  return (
    <div className="bg-white card-box border-20 mt-40">
      <h4 className="dash-title-three">Social Media</h4>
      {error && <ErrorMsg msg={error} />}
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id} className="dash-input-wrapper mb-20">
            <label htmlFor={`socialMediaLinks.${index}.network`}>Network {index + 1}</label>
            <input
              {...register(`socialMediaLinks.${index}.network` as const)}
              type="text"
              placeholder={`Enter Network ${index + 1} URL`}
            />
            {errors.socialMediaLinks?.[index]?.network && (
              <ErrorMsg msg={errors.socialMediaLinks[index].network?.message!} />
            )}
          </div>
        ))}
        <button type="button" className="dash-btn-one mb-20" onClick={() => append({ network: "" })}>
          <i className="bi bi-plus"></i> Add more link
        </button>
        <button type="submit" className="dash-btn-one">
          <i className="bi bi-check"></i> Save Links
        </button>
      </form>
    </div>
  );
};

export default SocialMediaLinksForm;
