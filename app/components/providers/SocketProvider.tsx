// app/components/providers/SocketProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

// Default context value
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Custom hook to use the socket context
export const useSocket = () => {
  return useContext(SocketContext);
};

// Provider component
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== "undefined") {
        // Connect to the Socket.IO server (running via socket-server.js)
        // Make sure the URL matches where your socket server is running
        const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");

        socketInstance.on("connect", () => {
        console.log("Socket.IO: Connected to server", socketInstance.id);
        setIsConnected(true);
        });

        socketInstance.on("disconnect", (reason) => {
        console.log("Socket.IO: Disconnected from server. Reason:", reason);
        setIsConnected(false);
        });

        socketInstance.on("connect_error", (error) => {
             console.error("Socket.IO Connection Error:", error);
             setIsConnected(false);
        });


        setSocket(socketInstance);

        // Cleanup function to disconnect socket when component unmounts
        return () => {
            console.log("Socket.IO: Disconnecting...");
            socketInstance.disconnect();
            setSocket(null);
            setIsConnected(false);
        };
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};