'use client';

import PageContainer from '@/components/layout/page-container';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { firestore } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

export default function ProjectPage() {
  const pathname = usePathname(); // Use usePathname to get the current path
  const router = useRouter();
  const [rowData, setRowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const projectId = pathname?.split('/').pop(); // Extract project ID from URL
      if (projectId) {
        try {
          const docRef = doc(firestore, 'projects', projectId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setRowData(docSnap.data());
          } else {
            setError('No such document!');
          }
        } catch (error) {
          console.error('Error fetching project data:', error);
          setError('Failed to fetch project data.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Invalid project ID.');
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]); // Use pathname as a dependency

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <h1>Project Details</h1>
        <pre>{JSON.stringify(rowData, null, 2)}</pre>
        {/* Render your project details based on rowData */}
      </div>
    </PageContainer>
  );
}
