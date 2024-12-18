"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useOthers, useSelf } from "@liveblocks/react/suspense";

const Avatars = () => {
  const self = useSelf();
  const others = useOthers();

  const allUsers = [self, ...others];

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-light">Users currently editing this page</p>
      <div className="flex -space-x-3">
        {allUsers.map((other, index) => (
          <TooltipProvider key={other.id + index}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-2 border-white hover:z-50">
                  <AvatarImage src={other.info.avatar} />
                  <AvatarFallback>{other.info.name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self.id === other.id ? "You" : other.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default Avatars;
