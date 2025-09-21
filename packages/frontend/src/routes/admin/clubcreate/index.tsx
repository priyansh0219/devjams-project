import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import APIClient from "../../../services/api-client";

interface CreateClubRequest {
  club_name: string;
  club_description: string;
  admin_email: string;
}

interface CreateClubResponse {
  message: string;
  club: {
    id: string;
    name: string;
    description: string;
  };
}

const createClubAPI = new APIClient<CreateClubResponse>("/admin/create-club", {
  withCredentials: true,
});

const ClubCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    club_name: "",
    club_description: "",
    admin_email: "",
  });
  const [error, setError] = useState<string | null>(null);

  const createClubMutation = useMutation({
    mutationFn: (data: CreateClubRequest) => createClubAPI.post(data),
    onSuccess: (response) => {
      console.log("Club created successfully:", response);
      // Reset form
      setFormData({
        club_name: "",
        club_description: "",
        admin_email: "",
      });
      setError(null);
      // Navigate to a success page or club list
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      console.error("Error creating club:", error);
      setError(error.response?.data?.error || "Failed to create club");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (
      !formData.club_name.trim() ||
      !formData.club_description.trim() ||
      !formData.admin_email.trim()
    ) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.admin_email)) {
      setError("Please enter a valid email address");
      return;
    }

    createClubMutation.mutate(formData);
  };

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-6 text-center text-gray-800'>
        Create New Club
      </h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='club_name'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Club Name
          </label>
          <input
            type='text'
            id='club_name'
            name='club_name'
            value={formData.club_name}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Enter club name'
            disabled={createClubMutation.isPending}
          />
        </div>

        <div>
          <label
            htmlFor='club_description'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Club Description
          </label>
          <textarea
            id='club_description'
            name='club_description'
            value={formData.club_description}
            onChange={handleInputChange}
            rows={4}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Enter club description'
            disabled={createClubMutation.isPending}
          />
        </div>

        <div>
          <label
            htmlFor='admin_email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Admin Email
          </label>
          <input
            type='email'
            id='admin_email'
            name='admin_email'
            value={formData.admin_email}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Enter admin email'
            disabled={createClubMutation.isPending}
          />
        </div>

        {error && (
          <div className='p-3 bg-red-100 border border-red-400 text-red-700 rounded-md'>
            {error}
          </div>
        )}

        {createClubMutation.isSuccess && (
          <div className='p-3 bg-green-100 border border-green-400 text-green-700 rounded-md'>
            Club created successfully!
          </div>
        )}

        <button
          type='submit'
          disabled={createClubMutation.isPending}
          className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
            createClubMutation.isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {createClubMutation.isPending ? "Creating Club..." : "Create Club"}
        </button>
      </form>
    </div>
  );
};

export const Route = createFileRoute("/admin/clubcreate/")({
  component: ClubCreatePage,
});
