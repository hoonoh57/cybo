import { ComponentConfig } from "@puckjs/core";
import { Button, ButtonProps } from "./Button";

export const ButtonPuck: ComponentConfig<ButtonProps> = {
  fields: {
    label: { type: "text" },
    variant: {
      type: "select",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Danger", value: "danger" },
        { label: "Ghost", value: "ghost" },
      ],
    },
    size: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    disabled: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
  },
  defaultProps: {
    label: "Button",
    variant: "primary",
    size: "md",
    disabled: false,
  },
  render: ({ label, variant, size, disabled, onClick }) => {
    return <Button label={label} variant={variant} size={size} disabled={disabled} onClick={onClick} />;
  },
};
