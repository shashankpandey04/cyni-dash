"use client";

import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/discord`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-900 via-black to-indigo-900 animate-gradient" />

      {/* Floating Glow Orbs */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl top-10 left-10 animate-float" />
      <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl bottom-10 right-10 animate-float-slow" />

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Login Card */}
      <div className="relative z-10 bg-gray-900/80 border border-gray-800 rounded-2xl p-10 w-full max-w-md text-center shadow-2xl backdrop-blur-lg">

        <h1 className="text-3xl font-bold mb-4">
          Welcome to CYNI
        </h1>

        <p className="text-gray-400 mb-8">
          Sign in with Discord to manage your servers.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-xl font-semibold text-white"
        >
          {loading ? "Redirecting..." : "Login with Discord"}
        </button>

      </div>
    </div>
  );
}
