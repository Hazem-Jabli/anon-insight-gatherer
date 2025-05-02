
import * as React from "react"
import { RadioGroup as RadixRadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

const Radio = React.forwardRef<
  React.ElementRef<typeof RadioGroupItem>,
  React.ComponentPropsWithoutRef<typeof RadioGroupItem>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupItem
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center">
        <div className="h-2.5 w-2.5 rounded-full bg-current"></div>
      </div>
    </RadioGroupItem>
  );
});
Radio.displayName = "Radio";

export { Radio, RadioGroupItem };
