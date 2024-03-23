import { cn } from "lib/utils"
import React from 'react';
import PropTypes from 'prop-types';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

Skeleton.propTypes = {
  className: PropTypes.string
};

export { Skeleton }
