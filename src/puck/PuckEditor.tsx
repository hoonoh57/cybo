import React from "react";
import { Puck } from "@puckjs/core";
import "@puckjs/core/dist/index.css";
import { config } from "./config";

export interface PuckEditorProps {
  data: any;
  onChange: (data: any) => void;
  onPublish: (data: any) => void;
}

export const PuckEditor: React.FC<PuckEditorProps> = ({ data, onChange, onPublish }) => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Puck
        config={config}
        data={data}
        onChange={onChange}
        onPublish={onPublish}
      />
    </div>
  );
};
