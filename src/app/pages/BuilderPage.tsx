import React from 'react';
import { PuckEditor } from '../../puck/PuckEditor';

const initialPuckData = {
  content: [],
  root: { title: "New Video" },
};

export const BuilderPage: React.FC = () => {
  const [data, setData] = React.useState(initialPuckData);

  const handleChange = (newData: any) => {
    setData(newData);
  };

  const handlePublish = (data: any) => {
    console.log("Published Puck Data:", data);
    alert("Project saved successfully!");
  }

  return (
    <div style={{ padding: "0" }}>
      <PuckEditor 
        data={data} 
        onChange={handleChange} 
        onPublish={handlePublish} 
      />
    </div>
  );
};
