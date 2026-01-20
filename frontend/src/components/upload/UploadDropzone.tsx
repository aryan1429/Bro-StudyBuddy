'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { Button } from '../ui/button'

export function UploadDropzone({ onUploadComplete }: { onUploadComplete?: () => void }) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            setSelectedFile(files[0])
        }
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setSelectedFile(files[0])
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        setProgress(0)
        setError(null)

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress((prev) => Math.min(prev + 10, 90))
        }, 200)

        try {
            await api.uploadDocument(selectedFile)

            clearInterval(progressInterval)
            setProgress(100)
            setSuccess(true)

            setTimeout(() => {
                setSelectedFile(null)
                setSuccess(false)
                setIsUploading(false)
                setProgress(0)
                onUploadComplete?.()
            }, 1500)
        } catch (err: any) {
            clearInterval(progressInterval)
            setError(err.message || 'Upload failed')
            setIsUploading(false)
            setProgress(0)
        }
    }

    return (
        <div className="w-full">
            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                animate={{ scale: isDragging ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
            >
                <div className="flex flex-col items-center justify-center space-y-4">
                    <motion.div
                        animate={{ y: isDragging ? -5 : 0 }}
                        className="p-4 rounded-full bg-primary/10"
                    >
                        <Upload className="w-8 h-8 text-primary" />
                    </motion.div>

                    <div className="text-center">
                        <p className="text-lg font-medium">
                            Drop your PDF or TXT file here
                        </p>
                        <p className="text-sm text-gray-500">or click to browse</p>
                    </div>

                    <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedFile && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 border rounded-lg bg-card"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            {!isUploading && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        {isUploading && (
                            <div className="mt-3">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <motion.div
                                        className="bg-primary h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{progress}% uploaded</p>
                            </div>
                        )}

                        {success && (
                            <p className="mt-2 text-sm text-green-600">✓ Upload successful!</p>
                        )}

                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}

                        {!isUploading && !success && (
                            <Button
                                onClick={handleUpload}
                                className="w-full mt-3"
                            >
                                Upload Document
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
