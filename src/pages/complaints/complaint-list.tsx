import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { format } from 'date-fns';
import {
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  MapPinIcon,
  MessageSquareTextIcon,
  CalendarIcon,
  TagIcon,
} from 'lucide-react';

export function ComplaintList() {
  const complaints = useQuery(api.complaints.listUserComplaints) ?? [];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'in progress':
        return <ClockIcon className="h-5 w-5 text-amber-600" />;
      default:
        return <AlertCircleIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquareTextIcon className="h-6 w-6" />
          Your Complaints
        </h2>
        <p className="text-slate-300 mt-1">
          Track the status of your reported issues
        </p>
      </div>

      {complaints.length === 0 ? (
        <div className="p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <AlertCircleIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700">
            No complaints yet
          </h3>
          <p className="text-slate-500 mt-1">
            Your submitted complaints will appear here
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="p-5 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-slate-900">
                  {complaint.title}
                </h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full border ${getStatusClass(complaint.status)} flex items-center gap-1 whitespace-nowrap`}>
                  {getStatusIcon(complaint.status)}
                  {complaint.status}
                </span>
              </div>

              <p className="text-slate-600 mb-4">{complaint.description}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 mb-4">
                {complaint.category?.name && (
                  <div className="flex items-center gap-1">
                    <TagIcon className="h-4 w-4 text-slate-400" />
                    <span>{complaint.category.name}</span>
                  </div>
                )}

                {complaint.location && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4 text-slate-400" />
                    <span>{complaint.location}</span>
                  </div>
                )}

                {complaint._creationTime && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-slate-400" />
                    <span>Submitted {formatDate(complaint._creationTime)}</span>
                  </div>
                )}
              </div>

              {complaint.responses?.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-1.5">
                    <MessageSquareTextIcon className="h-4 w-4" />
                    Responses ({complaint.responses.length})
                  </h4>

                  <div className="space-y-3">
                    {complaint.responses.map((response, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          response.isOfficial
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'bg-slate-50 border-l-4 border-slate-300'
                        }`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">
                            {response.isOfficial ? '👨‍💼 ' : '👤 '}
                            {response.responderName}
                          </p>
                          {response._creationTime && (
                            <span className="text-xs text-slate-500">
                              {formatDate(response._creationTime)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
