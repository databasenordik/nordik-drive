import { Button } from '@mui/material';
import styled from 'styled-components';
import {
  color_secondary,
  color_dv_control_border,
  color_dv_header_bg,
  color_dv_text_faint,
} from '../../constants/colors';
import React from 'react';

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/helper"

// Outline buttons in the navy design: white, thin grey border, navy text.
export const FileButton = styled(Button)`
    border: 1px solid ${color_dv_control_border} !important;
    color: ${color_secondary} !important;
    background: white !important;
    font-weight: 500;
    border-radius: 10px !important;
    min-height: 40px;
    box-shadow: none !important;

    &:hover {
        background: ${color_dv_header_bg} !important;
    }

    &.Mui-disabled {
        color: ${color_dv_text_faint} !important;
    }
`

export const CloseButton = styled(Button)`
    border: 1px solid ${color_dv_control_border} !important;
    color: ${color_secondary} !important;
    background: white !important;
    font-weight: 500;
    border-radius: 10px !important;
    min-height: 40px;
    box-shadow: none !important;

    &:hover {
        background: ${color_dv_header_bg} !important;
    }
`

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

ButtonComponent.displayName = "Button"

export { ButtonComponent, buttonVariants }