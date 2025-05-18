/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FormEvent, useState, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { toast } from 'sonner';

export function ComplaintForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  const categories = useQuery(api.complaints.listCategories) ?? [];
  const createComplaint = useMutation(api.complaints.createComplaint);
  const generateUploadUrl = useMutation(api.complaints.generateUploadUrl);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      let attachmentId = undefined;
      let attachmentName = undefined;

      if (file) {
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error('Failed to upload file');
        }

        const { storageId } = await result.json();
        attachmentId = storageId;
        attachmentName = file.name;
      }

      // Step 3: Create the complaint with the file ID if one was uploaded
      await createComplaint({
        title,
        description,
        categoryId: categoryId as any,
        location,
        attachmentId,
        attachmentName,
      });

      setTitle('');
      setDescription('');
      setCategoryId('');
      setLocation('');
      setFile(null);
      if (fileInput.current) {
        fileInput.current.value = '';
      }
      toast.success('Complaint submitted successfully');
    } catch (error: any) {
      toast.error(`Failed to submit complaint: ${error.message}`);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Submit a Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attachment
          </label>
          <input
            type="file"
            ref={fileInput}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full"
            accept="image/*,application/pdf"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload images or PDF documents related to your complaint
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
          Submit Complaint
        </button>
      </form>
    </div>
  );
}
