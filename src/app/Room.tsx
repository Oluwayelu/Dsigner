"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/client";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCK_PUBLIC_KEY!}
    >
      <RoomProvider
        id="my-room"
        /**
         * initialPresence is used to initialize the presence of the current
         * user in the room.
         *
         * initialPresence: https://liveblocks.io/docs/api-reference/liveblocks-react#RoomProvider
         */
        initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
        /**
         * initialStorage is used to initialize the storage of the room.
         *
         * initialStorage: https://liveblocks.io/docs/api-reference/liveblocks-react#RoomProvider
         */
        initialStorage={{
          /**
           * We're using a LiveMap to store the canvas objects
           *
           * LiveMap: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap
           */
          canvasObjects: new LiveMap(),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
