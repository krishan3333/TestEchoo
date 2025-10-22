"use client";

import { useState } from "react";
// Remove useRouter, it's not needed for this logic
// import { useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/use-modal-store";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export const CreateServerModal = () => {
  // **** GET data FROM THE HOOK ****
  const { isOpen, onClose, type, data } = useModal();
  const { onSuccess } = data; // Get the onSuccess callback from data
  // const router = useRouter(); // No longer needed here

  const isModalOpen = isOpen && type === "createServer";

  const [serverName, setServerName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setServerName("");
    setImageUrl("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: serverName, imageUrl }),
      });

      if (response.ok) {
        // **** THIS IS THE FIX ****
        const newServer = await response.json(); // Get the new server from the API response
        if (onSuccess) {
          onSuccess(newServer); // Pass the new server to the callback
        }
        // router.refresh(); // Remove this line
        // **** END OF FIX ****
        handleClose();
      } else {
        console.error("Failed to create server");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 space-y-4 bg-slate-900 border border-slate-700 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Create Your Server</h2>
          <p className="text-sm text-slate-400">
            Give your server a personality with a name and an image.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Server Name
            </label>
            <Input
              disabled={isLoading}
              className="bg-slate-800 border-slate-600 focus-visible:ring-blue-500"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="Enter server name"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Image URL (Optional)
            </label>
            <Input
              disabled={isLoading}
              className="bg-slate-800 border-slate-600 focus-visible:ring-blue-500"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              disabled={isLoading}
              variant="ghost"
              onClick={handleClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              type="submit"
            >
              {isLoading ? "Creating..." : "Create Server"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
