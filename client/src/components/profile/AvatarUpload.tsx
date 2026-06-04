"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";

export default function AvatarUpload() {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const updatedUser = await apiClient.uploadAvatar(file);
      setUser(updatedUser);
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      setError(
        err.response?.data?.message || 
        "Failed to upload avatar. Ensure Cloudinary credentials are set."
      );
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex flex-col items-center sm:flex-row gap-5 mb-8">
      <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/30 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-3xl shadow-lg shadow-purple-500/20">
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-white"
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
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={triggerFileInput}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 disabled:opacity-50 transition-all"
          >
            {uploading ? "Uploading..." : "Change Avatar"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          PNG, JPG or GIF. Max size 5MB.
        </p>
        {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
      </div>
    </div>
  );
}
