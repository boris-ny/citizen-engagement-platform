/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';

export function OfficialDashboard() {
  const category = useQuery(api.complaints.getOfficialCategory);
  const complaints = useQuery(api.complaints.listCategoryComplaints) ?? [];
  const addResponse = useMutation(api.complaints.addResponse);
  const [responseText, setResponseText] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(
    null
  );

  async function handleSubmitResponse(complaintId: string) {
    try {
      await addResponse({
        complaintId: complaintId as any,
        message: responseText,
      });
      setResponseText('');
      setSelectedComplaint(null);
      toast.success('Response submitted successfully');
    } catch (error: any) {
      toast.error(`Failed to submit response ${error.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-2">
          {category?.name} Department Dashboard
        </h2>
        <p className="text-gray-600">{category?.description}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Complaints</h3>
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-medium">{complaint.title}</h4>
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    complaint.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                  {complaint.status}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{complaint.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Location: {complaint.location}</p>
                <p>Submitted by: {complaint.submitter}</p>
              </div>

              {complaint.responses?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h5 className="font-medium">Responses:</h5>
                  {complaint.responses.map((response, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        response.isOfficial ? 'bg-blue-50' : 'bg-gray-50'
                      }`}>
                      <p className="text-sm font-medium">
                        {response.responderName}
                      </p>
                      <p className="text-sm">{response.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedComplaint === complaint._id ? (
                <div className="mt-4 space-y-2">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    rows={3}
                    placeholder="Type your response..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmitResponse(complaint._id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      Submit Response
                    </button>
                    <button
                      onClick={() => setSelectedComplaint(null)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedComplaint(complaint._id)}
                  className="mt-4 text-indigo-600 hover:text-indigo-800">
                  Add Response
                </button>
              )}
            </div>
          ))}
          {complaints.length === 0 && (
            <p className="text-gray-500 text-center">
              No complaints in your category
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
