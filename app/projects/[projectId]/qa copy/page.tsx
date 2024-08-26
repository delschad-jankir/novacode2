import React from 'react';
import PageContainer from '@/components/layout/page-container';
import InputBar from '@/components/InputBar';

const QandA = () => {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col min-h-full">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">General Information</h1>
          {/* Main content goes here */}
        </div>
      </div>
      <InputBar />
    </PageContainer>
  );
};

export default QandA;