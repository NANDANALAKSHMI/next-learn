import axiosInstance from "../instance/axios";

export const userLoginApi = async (data) => {
  try {
    const response = await axiosInstance.post('auth/send-otp', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyOtpApi = async (data) => {
  try {
    const response = await axiosInstance.post('auth/verify-otp', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const ProfileApi = async (data) => {
  try {
    const response = await axiosInstance.post('auth/create-profile', data);
    return response;
  } catch (error) {
    throw error;
  }
};




export const getQuestions = async (token) => {
  try {
    const res = await axiosInstance.get('question/list', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res
  } catch (error) {
    console.log(error);

  }
}
export const postAnswer = async (token, answers) => {
  console.log(answers, 'formdata');
  
  try {
    const res = await axiosInstance.post(
      'answers/submit',
      answers ,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json'
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error submitting answers:", error.response?.data || error.message);
    throw error;
  }
};