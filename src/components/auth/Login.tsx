import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    id: {
      title: "Selamat Datang Kembali",
      subtitle: "Silakan masukkan detail Anda untuk masuk.",
      username: "Username atau Email",
      password: "Password",
      loginButton: "Masuk",
      loggingIn: "Memproses...",
      heroTitle: "Memberdayakan Masa Depan Pendidikan",
      heroSubtitle:
        "Akses aman untuk Administrasi UPNVJ. Kelola sumber daya, mahasiswa, dan dosen secara efisien.",
      footer: "© 2024 Administrasi UPNVJ. Hak cipta dilindungi.",
    },
    en: {
      title: "Welcome Back",
      subtitle: "Please enter your details to sign in.",
      username: "Username or Email",
      password: "Password",
      loginButton: "Sign In",
      loggingIn: "Processing...",
      heroTitle: "Empowering the Future of Education",
      heroSubtitle:
        "Secure access for UPNVJ Administration. Manage resources, students, and faculty efficiently.",
      footer: "© 2024 UPNVJ Administration. All rights reserved.",
    },
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("📝 Form submitted");
    console.log("👤 Username:", username);
    console.log("🔑 Password length:", password.length);

    try {
      const result = await login(username, password);

      console.log("Login result:", result);

      if (result.success) {
        console.log("Login successful, navigating to /admin");
        navigate("/admin");
      } else {
        console.error("Login failed:", result.message);
        setError(result.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Login exception:", err);
      setError(err.message || "Terjadi kesalahan tidak terduga");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Panel: Visual Anchor */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-900">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAz9rcxciIr0_3ekg8WQZRlsaxt4h94OHIQmctdYfNRuahGwUcQLAYKo4PMlGp_RnSHqF6sxzhURnsmsveK4QGIiQIVIau1ocf-K-fnFyHYO3cd6-XOFqJEI4k6ljCNDKkSphVwaZrkK988Jp1z8pYUSltnP6GuGC_Is4soFqwSZRhkenM01zfJM_lgpL9oif4qqQPQmFS_myCAbeUs3JTvsgl51tQIwb_cpJk8arVarC_4pLaI9AKLY-HiLfer98-xqEE2EWgOCEY')",
            filter: "blur(2px)",
          }}
        />

        {/* Color Overlay */}
        <div className="absolute inset-0 bg-[#2C5F2D]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full text-white">
          <div></div>
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold leading-tight mb-4">
              {t.heroTitle}
            </h2>
            <p className="text-lg text-gray-100 opacity-90 font-medium">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white px-6 py-12 lg:px-24 h-full overflow-y-auto">
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {t.title}
            </h1>
            <p className="text-slate-500 font-medium text-base">{t.subtitle}</p>
          </div>

          {/* Form Section */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                {t.username}
              </label>
              <div className="input-group flex items-center w-full rounded-xl bg-gray-50 border border-gray-200 transition-all duration-200 overflow-hidden focus-within:border-[#2C5F2D] focus-within:shadow-[0_0_0_1px_#2C5F2D]">
                <div className="pl-4 pr-2 text-slate-400">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    person
                  </span>
                </div>
                <input
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-slate-400 h-12 text-base font-medium"
                  placeholder="Enter your username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                {t.password}
              </label>
              <div className="input-group flex items-center w-full rounded-xl bg-gray-50 border border-gray-200 transition-all duration-200 overflow-hidden focus-within:border-[#2C5F2D] focus-within:shadow-[0_0_0_1px_#2C5F2D]">
                <div className="pl-4 pr-2 text-slate-400">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    lock
                  </span>
                </div>
                <input
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-slate-400 h-12 text-base font-medium"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  className="pr-4 pl-2 text-slate-400 hover:text-[#2C5F2D] transition-colors focus:outline-none"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full h-12 bg-[#2C5F2D] hover:bg-[#234d24] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-[#2C5F2D]/25 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{t.loggingIn}</span>
                </>
              ) : (
                <>
                  <span>{t.loginButton}</span>
                  <span
                    className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                    style={{ fontSize: "20px" }}
                  >
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-auto pt-6 text-center">
            <p className="text-xs text-slate-400 font-medium">{t.footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
