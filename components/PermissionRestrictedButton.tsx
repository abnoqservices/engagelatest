"use client";

import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lock } from "lucide-react";

interface PermissionRestrictedButtonProps extends ButtonProps {
  hasPermission: boolean;
  requiredPermission: string;
  resource: string;
  action: string;
  children: React.ReactNode;
}

/**
 * Button component that shows a tooltip explaining why it's disabled when user lacks permission
 */
export function PermissionRestrictedButton({
  hasPermission,
  requiredPermission,
  resource,
  action,
  children,
  onClick,
  disabled,
  asChild,
  ...props
}: PermissionRestrictedButtonProps) {
  const permissionMessage = `You need "${requiredPermission}" permission to ${action} ${resource}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasPermission) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  // If user has permission and asChild is true, clone the child and pass props
  if (hasPermission && asChild) {
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, {
      ...child.props,
      ...props,
      onClick: (e: React.MouseEvent) => {
        handleClick(e as any);
        child.props?.onClick?.(e);
      },
    });
  }

  // If user has permission but no asChild, render normal button
  if (hasPermission) {
    return (
      <Button onClick={handleClick} disabled={disabled} {...props}>
        {children}
      </Button>
    );
  }

  // If no permission, show disabled button with tooltip (never use asChild here)
  const { asChild: _, ...restProps } = props;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block">
            <Button
              onClick={handleClick}
              disabled={true}
              variant="outline"
              className="opacity-50 cursor-not-allowed"
              {...restProps}
            >
              <Lock className="mr-2 h-4 w-4" />
              {children}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-medium mb-1">Permission Required</p>
            <p className="text-xs">{permissionMessage}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Contact your administrator to request access.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface PermissionRestrictedMenuItemProps {
  hasPermission: boolean;
  requiredPermission: string;
  resource: string;
  action: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Dropdown menu item that shows a tooltip when disabled due to permissions
 */
export function PermissionRestrictedMenuItem({
  hasPermission,
  requiredPermission,
  resource,
  action,
  children,
  onClick,
  className = "",
}: PermissionRestrictedMenuItemProps) {
  const permissionMessage = `You need "${requiredPermission}" permission to ${action} ${resource}`;

  if (hasPermission) {
    return <>{children}</>;
  }

  // Clone the child element and add disabled state and styling
  const childElement = React.Children.only(children) as React.ReactElement;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            {React.cloneElement(childElement, {
              ...childElement.props,
              disabled: true,
              className: `${childElement.props?.className || ""} opacity-50 cursor-not-allowed`,
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
              },
            })}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-medium mb-1">Permission Required</p>
            <p className="text-xs">{permissionMessage}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Contact your administrator to request access.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
