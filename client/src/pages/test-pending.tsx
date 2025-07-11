import { useInternships } from "@/lib/convexApi";

export default function TestPending() {
  const { data: internships = [], isLoading, error } = useInternships();
  
  // Filter pending internships on the client side
  const pendingInternships = internships.filter((internship: any) => 
    internship.status === 'pending' || !internship.isApproved
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold text-orange-400 mb-4">Loading Test Page</h1>
        <div className="text-gray-300">Loading pending internships...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Data</h1>
        <div className="text-red-300 mb-4">Error: {error.message || 'Unknown error'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold text-orange-400 mb-4">Pending Internships Test</h1>
      
      <div className="mb-6">
        <div className="text-green-400 text-lg">✓ Convex Connection Working</div>
        <div className="text-gray-300">Found {pendingInternships.length} pending internships</div>
      </div>

      <div className="space-y-4">
        {pendingInternships.length > 0 ? (
          pendingInternships.map((internship: any) => (
            <div key={internship._id} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{internship.title}</h3>
                  <p className="text-orange-400">{internship.company}</p>
                  <p className="text-gray-400 text-sm">Posted by: {internship.posterEmail}</p>
                </div>
                <div className="bg-yellow-900 text-yellow-300 px-3 py-1 rounded text-sm">
                  {internship.status}
                </div>
              </div>
              
              <div className="text-gray-300 text-sm mb-4">
                {internship.description}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>Duration: {internship.duration}</div>
                <div>Department: {internship.department || 'Not specified'}</div>
                <div>Paid: {internship.isPaid ? 'Yes' : 'No'}</div>
                <div>Positions: {internship.positions}</div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={() => console.log('Approve internship:', internship._id)}
                >
                  Approve
                </button>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={() => console.log('Reject internship:', internship._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No pending internships found</div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-900 rounded">
        <h3 className="text-lg font-semibold text-white mb-2">Raw Convex Response:</h3>
        <pre className="text-xs text-gray-300 overflow-auto">
          {JSON.stringify(pendingInternships, null, 2)}
        </pre>
      </div>
    </div>
  );
}