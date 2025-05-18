/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const categories = useQuery(api.complaints.listCategories) ?? [];
  const officials = useQuery(api.admin.listOfficials) ?? [];
  const addOfficial = useMutation(api.admin.addOfficial);
  const addCategory = useMutation(api.admin.addCategory);

  const [email, setEmail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');

  // New category form state
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  async function handleAddOfficial(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addOfficial({
        email,
        categoryId: categoryId as any,
        title,
      });
      setEmail('');
      setCategoryId('');
      setTitle('');
      toast.success('Official added successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addCategory({
        name: categoryName,
        description: categoryDescription,
      });
      setCategoryName('');
      setCategoryDescription('');
      toast.success('Category added successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            Add Category
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Add Official</h2>
        <form onSubmit={handleAddOfficial} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            Add Official
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-gray-500 text-center">No categories added yet</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Officials</h2>
        <div className="space-y-4">
          {officials.map((official) => (
            <div key={official._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{official.email}</h3>
                  <p className="text-gray-600">{official.title}</p>
                </div>
                <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {official.categoryName}
                </span>
              </div>
            </div>
          ))}
          {officials.length === 0 && (
            <p className="text-gray-500 text-center">No officials added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
