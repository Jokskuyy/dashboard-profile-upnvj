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
      title: "Masuk",
      subtitle: "Akses portal administrasi UPNVJ",
      username: "Username atau Email",
      password: "Password",
      loginButton: "Masuk",
      loggingIn: "Memproses...",
      backToHome: "Kembali ke Beranda",
      footer: "© 2026 UPN Veteran Jakarta",
    },
    en: {
      title: "Sign In",
      subtitle: "Access the UPNVJ administration portal",
      username: "Username or Email",
      password: "Password",
      loginButton: "Sign In",
      loggingIn: "Processing...",
      backToHome: "Back to Home",
      footer: "© 2026 UPN Veteran Jakarta",
    },
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        navigate("/admin");
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen min-h-[100dvh] w-full relative flex items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-6 sm:py-8">
      {/* Full-screen background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero1.webp')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#1a3a1b]/75 backdrop-blur-sm" />
      
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2C5F2D] via-[#4a9e4c] to-[#2C5F2D]" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex min-h-11 items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 sm:mb-8 group"
        >
          <span className="material-icons-round text-lg group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="text-sm font-medium">{t.backToHome}</span>
        </button>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
          {/* Card Header */}
          <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-0 flex flex-col items-center">
            <img
              src="/logoupnvj.webp"
              alt="Logo UPNVJ"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-3 sm:mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {t.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">{t.subtitle}</p>
          </div>

          {/* Divider */}
          <div className="mx-5 sm:mx-8 h-px bg-gray-200" />

          {/* Form */}
          <form className="px-5 sm:px-8 pt-5 sm:pt-6 pb-5 sm:pb-8 space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <span className="material-icons-round text-lg shrink-0">error_outline</span>
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-0.5">
                {t.username}
              </label>
              <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 transition-all duration-200 overflow-hidden focus-within:border-[#2C5F2D] focus-within:ring-1 focus-within:ring-[#2C5F2D]">
                <div className="pl-4 pr-2 text-gray-400">
                  <span className="material-icons-round text-xl">person</span>
                </div>
                <input
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 h-12 text-sm font-medium pr-4"
                  placeholder="admin@upnvj.ac.id"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-0.5">
                {t.password}
              </label>
              <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 transition-all duration-200 overflow-hidden focus-within:border-[#2C5F2D] focus-within:ring-1 focus-within:ring-[#2C5F2D]">
                <div className="pl-4 pr-2 text-gray-400">
                  <span className="material-icons-round text-xl">lock</span>
                </div>
                <input
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 h-12 text-sm font-medium"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  className="pr-4 pl-2 text-gray-400 hover:text-[#2C5F2D] transition-colors focus:outline-none"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <span className="material-icons-round text-xl">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#2C5F2D] hover:bg-[#234d24] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-[#2C5F2D]/25 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>{t.loggingIn}</span>
                </>
              ) : (
                <>
                  <span>{t.loginButton}</span>
                  <span className="material-icons-round text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/40 mt-6 font-medium">
          {t.footer}
        </p>
      </div>
    </div>
  );
};

export default Login;
