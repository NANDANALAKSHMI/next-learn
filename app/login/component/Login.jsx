'use client'
import Banner from '@/app/shared/Banner';
import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { userLoginApi } from '@/app/ApiService/apiServices';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!phoneNumber || phoneNumber.length < 5) {
            enqueueSnackbar("Please enter a valid phone number", {
                variant: "error",
                autoHideDuration: 3000,
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
            return;
        }

        setIsLoading(true);

        try {
            const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

            localStorage.setItem('authMobile', formattedPhoneNumber);

            const formData = new FormData();
            formData.append('mobile', formattedPhoneNumber);

            const response = await userLoginApi(formData);

            setIsLoading(false);

            if (response?.data?.success) {
                enqueueSnackbar(response?.data?.message || "OTP sent successfully", {
                    variant: "success",
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                router.push('/otp');
            } else {
                enqueueSnackbar(response?.data?.message || "Something went wrong", {
                    variant: "error",
                    autoHideDuration: 3000,
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
            }
        } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(error.message || "Server error", {
                variant: "error",
                autoHideDuration: 3000,
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
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

            <div className="flex bg-slate-800 rounded-lg overflow-hidden shadow-2xl w-full max-w-5xl relative z-10">
                <Banner />

                <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center ">
                    <h2 className="text-xl font-bold mb-2">Enter your phone number</h2>
                    <p className="text-sm text-gray-600 mb-6">We use your mobile number to identify your account</p>

                    <form onSubmit={handleSubmit}>
                        <label className="block text-sm text-gray-600 mb-2 pl-1">Phone number</label>

                        <PhoneInput
                            country={"in"}
                            enableSearch
                            preferredCountries={["us", "gb", "in", "ae", "kw"]}
                            value={phoneNumber}
                            onChange={(value, country, e, formattedValue) => {
                                setPhoneNumber(value);
                            }}
                            inputProps={{
                                name: "mobile",
                                required: true,
                                autoComplete: "tel",
                            }}
                            inputStyle={{
                                width: 'calc(100% - 40px)',
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                marginLeft: '40px',
                                height: '50px',
                                backgroundColor: '#f7f7f7',
                                border: 'none',
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-4 mb-6">
                            By tapping Get started, you agree to the
                            <a href="#" className="text-blue-600 underline ml-1">Terms & Conditions</a>
                        </p>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-700 text-white p-3 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Sending OTP..." : "Get Started"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;