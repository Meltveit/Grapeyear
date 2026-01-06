'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        // 1. Client-side Size Check (Max 4.5MB)
        if (file.size > 4.5 * 1024 * 1024) {
            setError("File is too large. Max 4.5MB.");
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setUploading(true);
        setError('');

        try {
            const response = await fetch(
                `/api/upload?filename=${encodeURIComponent(file.name)}`,
                {
                    method: 'POST',
                    body: file,
                },
            );

            // Robust response handling: Read as text first to handle non-JSON errors (like 413)
            const responseText = await response.text();
            let responseData;

            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                // Not JSON (likely HTML or Plain Text error from Vercel/Next)
                throw new Error(responseText.substring(0, 100) || `Upload failed with status ${response.status}`);
            }

            if (!response.ok) {
                throw new Error(responseData.error || 'Upload failed');
            }

            onChange(responseData.url);
        } catch (err: any) {
            console.error("Upload error:", err);
            // Clean up error message for common cases
            let msg = err.message || 'Error uploading file';
            if (msg.includes("Request Entity Too Large") || msg.includes("body exceeded")) {
                msg = "File is too large for the server. Try a smaller file (Max 4.5MB).";
            }
            if (msg.includes("Unexpected token")) {
                msg = "Server returned an invalid response. File might be too large.";
            }
            setError(msg);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-bold text-gray-400 mb-2">{label}</label>

            <div className="flex items-start gap-4">
                {/* Preview */}
                {value ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-600 bg-gray-900 group">
                        <Image
                            src={value}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-500 bg-black/20">
                        <span className="text-xs">No Image</span>
                    </div>
                )}

                {/* Controls */}
                <div className="flex-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder="Or paste URL..."
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs">{error}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            Supported: JPG, PNG, WEBP (Max 4.5MB)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
