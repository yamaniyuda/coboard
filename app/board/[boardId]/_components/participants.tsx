"use client"

import { useSelf, useOthers } from "@liveblocks/react/suspense";
import { UserAvatar } from "./user-avatar";
import { connectionIdToCoor } from "@/lib/utils";

const MAX_SHOWN_USERS = 2

export const Participants = () => {
  const currentUser = useSelf((me) => me);
  const users = useOthers();

  
  const hasMoreUsers = users.length > MAX_SHOWN_USERS

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
      <div className="flex gap-x-2 items-center">
        {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => {
          return (
            <UserAvatar
              borderColor={connectionIdToCoor(connectionId)}
              key={connectionId}
              src={info?.picture}
              name={info?.name}
              fallback={info?.name?.[0] || "T"}
            />
          )
        })}

        {currentUser && (
          <UserAvatar
            borderColor={connectionIdToCoor(currentUser.connectionId)}
            src={currentUser.info.picture}
            name={`${currentUser.info.name} (You)`}
            fallback={currentUser.info.name?.[0]}
          />
        )}

        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
};


export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 felx items-center shadow-md w-[100px]"></div>
  );
};
