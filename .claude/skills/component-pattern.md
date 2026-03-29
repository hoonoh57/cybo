# Component Writing Pattern

Follow this pattern when creating components:

## Folder Structure
- Name: `MyComponent/`
- `MyComponent.tsx`: Main component file.
- `MyComponent.module.css`: CSS Module for styling.
- `MyComponent.stories.tsx`: Storybook for visual testing.
- `MyComponent.puck.ts`: Configuration for Puck visual editor.

## Template for Components
```tsx
import React from 'react';
import styles from './MyComponent.module.css';

export interface MyComponentProps {
  label: string;
  onClick?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ label, onClick }) => {
  return (
    <div className={styles.root} onClick={onClick}>
      {label}
    </div>
  );
};
```

## Template for Puck Config
```ts
import { ComponentConfig } from "@puckjs/core";
import { MyComponentProps } from "./MyComponent";

export const MyComponentPuck: ComponentConfig<MyComponentProps> = {
  fields: {
    label: { type: "text" },
  },
  render: ({ label }) => {
    return <MyComponent label={label} />;
  },
};
```
