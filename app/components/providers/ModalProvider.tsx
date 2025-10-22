// app/components/providers/ModalProvider.tsx
"use client"
import { useEffect, useState } from "react";
// Import your actual modal components
import { CreateServerModal } from "../modals/CreateServerModal";
import { JoinServerModal } from "../modals/JoinServerModal";
// Import other modals like CreateChannelModal here if you create them

export const ModalProvider = () => {
    // State to prevent hydration errors with modals
    const [isMounted , setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Set mounted state only on the client-side
    }, []);

    // Don't render modals on the server or during initial client render mismatch
    if(!isMounted){
        return null;
    }

    // Render all possible modal components
    // Their internal logic (using useModal hook) determines if they are visible
    return (
        <> {/* Use Fragment to avoid unnecessary div */}
            <CreateServerModal />
            <JoinServerModal />
            {/* <CreateChannelModal />  Add other modals here */}
        </>
    );
}