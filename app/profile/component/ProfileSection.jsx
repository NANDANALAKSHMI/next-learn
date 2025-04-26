'use client'
import Banner from '@/app/shared/Banner';
import { useState } from 'react';
import { ProfileApi } from '@/app/ApiService/apiServices';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const ProfileSection = () => {
  const router = useRouter();
  const mobile = localStorage.getItem('authMobile'); 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualification: '',
    profileImage: null
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mobile) {
      enqueueSnackbar("Mobile number not found. Please login again.", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    if (!formData.profileImage) {
      enqueueSnackbar("Please upload a profile image", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('mobile', mobile);
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('qualification', formData.qualification);
      data.append('profile_image', formData.profileImage);

      const response = await ProfileApi(data);

      if (response.data.success) {
        Cookies.set('access_token', response.data.access_token, { expires: 1 }); 
        Cookies.set('refresh_token', response.data.refresh_token, { expires: 7 }); 
        

        localStorage.setItem('userData', JSON.stringify(response.data.user));

        enqueueSnackbar(response.data.message || "Profile created successfully!", {
          variant: "success",
          autoHideDuration: 2000,
        });

        router.push('/instructions');
      } else {
        enqueueSnackbar(response.data.message || "Profile creation failed", {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "An error occurred", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-gradient relative overflow-hidden p-4">
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-64 bg-blue-600 rounded-full transform -rotate-12"
            style={{
              top: `${i * 15 - 20}%`,
              left: `${i * 5 - 50}%`,
              width: '200%',
              filter: 'blur(80px)',
              opacity: 0.3
            }}
          />
        ))}
      </div>
      
      {/* Profile form */}
      <div className="flex bg-slate-800 rounded-lg overflow-hidden shadow-2xl w-full max-w-5xl relative z-10">
        <Banner/>
        
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-6">Add Your Details</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Profile image upload */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 border border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                {formData.profileImage ? (
                  <div className="w-full h-full rounded-md overflow-hidden">
                    <img 
                      src={URL.createObjectURL(formData.profileImage)} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  accept="image/*"
                  required
                />
              </div>
            </div>
            
            {/* Name field */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Name*</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your Full Name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Email field */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email Address"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Qualification field */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">Your qualification*</label>
              <select
                name="qualification"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.qualification}
                onChange={handleInputChange}
                required
              >
                <option value="">Select qualification</option>
                <option value="highschool">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Submit button */}
            <button 
              type="submit" 
              className="w-full bg-slate-700 text-white p-3 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Get Started'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;