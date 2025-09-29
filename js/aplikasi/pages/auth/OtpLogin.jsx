// resources/js/aplikasi/pages/auth/OtpLogin.jsx
import React, { useState, useContext } from "react";
import axios from "@/aplikasi/utils/axios";
import AuthContext from "@/aplikasi/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const OtpLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: kirim OTP, 2: verifikasi
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axios.post("/api/otp/send", { phone });
      setStep(2);
      alert("OTP telah dikirim!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Gagal mengirim OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("/api/otp/verify", { phone, otp });
      console.log(res.data);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("OTP salah atau kadaluarsa");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {step === 1 && (
        <>
          <h2 className="text-lg font-bold mb-4">Login OTP</h2>
          <input
            type="text"
            placeholder="Nomor HP"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <button
            onClick={handleSendOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kirim OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-lg font-bold mb-4">Masukkan OTP</h2>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Verifikasi OTP
          </button>
        </>
      )}
    </div>
  );
};

export default OtpLogin;
