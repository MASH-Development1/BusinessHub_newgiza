import { useEffect, useState } from "react";

export default function TestPending() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching pending internships...');
        const response = await fetch('/api/admin/internships/pending', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Raw API response:', result);
        console.log('Number of pending internships:', result.length);
        
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
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
        <div className="text-red-300 mb-4">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold text-orange-400 mb-4">Pending Internships Test</h1>
      
      <div className="mb-6">
        <div className="text-green-400 text-lg">✓ API Connection Working</div>
        <div className="text-gray-300">Found {data?.length || 0} pending internships</div>
      </div>

      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((internship: any) => (
            <div key={internship.id} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
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
                  onClick={() => console.log('Approve internship:', internship.id)}
                >
                  Approve
                </button>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={() => console.log('Reject internship:', internship.id)}
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
        <h3 className="text-lg font-semibold text-white mb-2">Raw API Response:</h3>
        <pre className="text-xs text-gray-300 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}