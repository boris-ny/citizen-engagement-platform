/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { toast } from 'sonner';
import {
  AlertTriangleIcon,
  FileTextIcon,
  MapPinIcon,
  SendIcon,
  TagIcon,
  HelpCircleIcon,
} from 'lucide-react';

export function ComplaintForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useQuery(api.complaints.listCategories) ?? [];
  const createComplaint = useMutation(api.complaints.createComplaint);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createComplaint({
        title,
        description,
        categoryId: categoryId as any,
        location,
      });
      setTitle('');
      setDescription('');
      setCategoryId('');
      setLocation('');
      toast.success('Complaint submitted successfully', {
        description: 'Your complaint has been recorded and will be reviewed.',
      });
    } catch (error: any) {
      toast.error('Submission failed', {
        description: error.message || 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangleIcon className="h-6 w-6" />
          Submit a Complaint
        </h2>
        <p className="text-indigo-100 mt-1">
          Report an issue in your community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <FileTextIcon className="h-4 w-4 text-slate-500" /> Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2.5"
            placeholder="Brief summary of the issue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <TagIcon className="h-4 w-4 text-slate-500" /> Category
          </label>
          <div className="relative">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 appearance-none px-4 py-2.5"
              required>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <MapPinIcon className="h-4 w-4 text-slate-500" /> Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2.5"
            placeholder="Street address or landmark"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <HelpCircleIcon className="h-4 w-4 text-slate-500" /> Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2.5"
            rows={4}
            placeholder="Provide details about the issue..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 text-white font-medium rounded-md py-3 px-4 flex items-center justify-center transition gap-2">
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <SendIcon className="h-4 w-4" />
              Submit Complaint
            </>
          )}
        </button>
      </form>
    </div>
  );
}
