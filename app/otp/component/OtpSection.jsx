'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import Banner from '@/app/shared/Banner';
import { userLoginApi, verifyOtpApi } from '@/app/ApiService/apiServices';

const OtpSection = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [mobile, setMobile] = useState('');
  const router = useRouter();


  useEffect(() => {
    const storedMobile = localStorage.getItem('authMobile');
    if (!storedMobile) {
      router.push('/login');
      enqueueSnackbar("Please login first", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } else {
      setMobile(storedMobile);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);


  const formatMobileNumber = (num) => {
    if (!num) return '+XX XXXX XXXXXX';
    const countryCode = num.substring(0, 3);
    const firstPart = num.substring(3, 7);
    const secondPart = num.substring(7);
    return `${countryCode} ${firstPart} ${secondPart}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      enqueueSnackbar("Please enter a valid 6-digit OTP", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('otp', otp);

      const response = await verifyOtpApi(formData);

      if (response?.data?.success) {

        enqueueSnackbar("OTP verified successfully!", {
          variant: "success",
          autoHideDuration: 2000,
        });

        router.push('/profile');
      } else {
        enqueueSnackbar(response?.data?.message || "Invalid OTP", {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Verification failed", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setIsResending(true);

    try {
      const formData = new FormData();
      formData.append('mobile', mobile);

      const response = await userLoginApi(formData);

      if (response?.data?.success) {
        setCountdown(30);
        enqueueSnackbar("New OTP sent successfully", {
          variant: "success",
          autoHideDuration: 2000,
        });
      } else {
        enqueueSnackbar(response?.data?.message || "Failed to resend OTP", {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Resend failed", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setIsResending(false);
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

        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-2">Enter the code we texted you</h2>
          <p className="text-sm text-gray-600 mb-6">
            We've sent an SMS to {formatMobileNumber(mobile)}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm text-gray-600 mb-2">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="123456"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtp(value);
                }}
                required
              />
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Your 6-digit code is on its way. This can sometimes take a few moments to arrive.
            </p>

            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending || countdown > 0}
                className="text-blue-600 text-sm font-medium hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend code'}
              </button>

              <span className="text-xs text-gray-500">
                {countdown > 0
                  ? `Try again in ${countdown}s`
                  : "Didn't receive code?"}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-slate-700 text-white p-3 rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpSection;