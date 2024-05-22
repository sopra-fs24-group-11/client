"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import PropTypes from "prop-types";

import { cn } from "lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Use a React state to manage the loaded value
  const [loadedValue, setLoadedValue] = React.useState(0);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoadedValue(value);
    }, 500); 
    
    return () => clearTimeout(timeoutId);
  }, [value]); 

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-green-600 transition-all duration-1000" // duration-10000 makes the transition take 10 seconds
        style={{ transform: `translateX(-${100 - loadedValue}%)` }} // use loadedValue here
      />
    </ProgressPrimitive.Root>
  );
});

Progress.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number,
};
Progress.displayName = "Progress";

export { Progress };
