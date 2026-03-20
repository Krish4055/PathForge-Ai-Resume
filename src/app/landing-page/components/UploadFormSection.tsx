'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Upload, X, ChevronDown, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { mapBackendResponse } from '@/lib/api-mapper';

type FormValues = {
  jobDescription: string;
  targetRole: string;
};

const targetRoles = [
  'Senior Full-Stack AI Engineer',
  'Frontend Engineer (React/Next.js)',
  'Backend Engineer (Python/FastAPI)',
  'DevOps / Platform Engineer',
  'ML Engineer',
  'Data Engineer',
  'Full-Stack Engineer',
  'Site Reliability Engineer',
];

export default function UploadFormSection() {
  const router = useRouter();
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      jobDescription: '',
      targetRole: 'Senior Full-Stack AI Engineer',
    },
  });

  const jdValue = watch('jobDescription');
  const JD_MAX_CHARS = 3000;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      setUploadedFile(file);
    } else {
      toast.error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const onSubmit = async (data: FormValues) => {
    if (!uploadedFile) {
      toast.error('Please upload your resume before analyzing.');
      return;
    }
    if (data.jobDescription.trim().length < 50) {
      toast.error('Please enter a more detailed job description (at least 50 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('resume_pdf', uploadedFile);
      formData.append('job_description', data.jobDescription);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please check the backend connection.');
      }

      const result = await response.json();
      const mappedResult = mapBackendResponse(result, data.targetRole);
      
      // Store in localStorage for ResultsPage
      localStorage.setItem('pathforge_analysis_result', JSON.stringify(mappedResult));

      toast.success('Analysis complete!');
      router.push('/results-page');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during analysis.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="upload-form" className="py-24 relative">
      <Toaster position="bottom-right" theme="dark" />

      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-16">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Start Your Analysis
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Upload your resume and paste the job description. Our AI engine handles the rest in
            under 30 seconds.
          </p>
        </div>

        {/* Form card */}
        <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Target Role selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">
                Target Role
              </label>
              <p className="text-xs text-zinc-500 mb-2.5">
                Select the role you're applying for — this tunes the AI's skill extraction.
              </p>
              <div className="relative">
                <select
                  {...register('targetRole')}
                  className="w-full appearance-none bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 font-medium focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                >
                  {targetRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Resume upload */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-zinc-300 mb-1.5">
                Resume / CV{' '}
                <span className="text-pink-400">*</span>
              </label>
              <p className="text-xs text-zinc-500 mb-2.5">
                PDF or DOCX format, max 5MB. Text will be extracted using pdfplumber.
              </p>

              {uploadedFile ? (
                /* Uploaded state */
                <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                  <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-emerald-300 truncate">
                      {uploadedFile.name}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {(uploadedFile.size / 1024).toFixed(1)} KB — ready for analysis
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                /* Drop zone */
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload resume — drag and drop or click to browse"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-indigo-500/70 bg-indigo-500/10 scale-[1.01]'
                      : 'border-white/10 hover:border-indigo-500/40 hover:bg-white/3 bg-zinc-900/50'
                  }`}
                >
                  <div
                    className={`p-4 rounded-full transition-all ${
                      dragOver ? 'bg-indigo-500/20' : 'bg-zinc-800'
                    }`}
                  >
                    <Upload
                      size={28}
                      className={dragOver ? 'text-indigo-400' : 'text-zinc-500'}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-zinc-300">
                      {dragOver ? 'Drop your resume here' : 'Drag & drop your resume'}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      or{' '}
                      <span className="text-indigo-400 font-medium underline underline-offset-2">
                        browse files
                      </span>{' '}
                      — PDF or DOCX
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="sr-only"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            {/* Job Description textarea */}
            <div className="mb-8">
              <label
                htmlFor="jobDescription"
                className="block text-sm font-semibold text-zinc-300 mb-1.5"
              >
                Job Description{' '}
                <span className="text-pink-400">*</span>
              </label>
              <p className="text-xs text-zinc-500 mb-2.5">
                Paste the full JD from LinkedIn, Greenhouse, or any job board. More detail = better
                gap analysis.
              </p>
              <textarea
                id="jobDescription"
                {...register('jobDescription', {
                  required: 'Job description is required.',
                  minLength: { value: 50, message: 'Please enter at least 50 characters.' },
                  maxLength: {
                    value: JD_MAX_CHARS,
                    message: `Maximum ${JD_MAX_CHARS} characters allowed.`,
                  },
                })}
                rows={8}
                placeholder="We are looking for a Senior Full-Stack AI Engineer to join our platform team. You will work on LLM-powered features, build FastAPI microservices, deploy to Kubernetes, and collaborate with the ML team on PyTorch model integration..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all scrollbar-thin font-sans leading-relaxed"
              />
              {/* Character count + error */}
              <div className="flex items-start justify-between mt-1.5 gap-2">
                {errors.jobDescription ? (
                  <p className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle size={12} />
                    {errors.jobDescription.message}
                  </p>
                ) : (
                  <span />
                )}
                <span
                  className={`text-xs font-mono ml-auto flex-shrink-0 ${
                    jdValue.length > JD_MAX_CHARS * 0.9
                      ? 'text-amber-400' :'text-zinc-600'
                  }`}
                >
                  {jdValue.length}/{JD_MAX_CHARS}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] hover:opacity-90 hover:shadow-xl hover:shadow-indigo-500/20"
              style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Initializing AI Engine...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Analyze My Skill Gaps
                </>
              )}
            </button>

            <p className="text-center text-xs text-zinc-600 mt-4">
              Your resume is processed in-memory and never stored permanently.{' '}
              <span className="text-zinc-500">Analysis takes ~20–30 seconds.</span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}