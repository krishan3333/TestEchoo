"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/app/hooks/use-modal-store";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export const JoinServerModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const router = useRouter();
  const isModalOpen = isOpen && type === "joinServer";

  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/invites/${inviteCode}`, {
        method: "PATCH",
      });

      if (response.ok) {
        onClose();
        router.refresh();
      } else {
        console.error("Failed to join server");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md p-6 space-y-4 bg-slate-900 border border-slate-700 rounded-lg">
            <h2 className="text-2xl font-bold text-center text-white">Join a Server</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    disabled={isLoading}
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter invite code"
                    className="bg-slate-800 border-slate-600"
                    required
                />
                <div className="flex justify-end gap-2">
                    <Button disabled={isLoading} variant="ghost" onClick={onClose} type="button">Cancel</Button>
                    <Button disabled={isLoading} type="submit">Join Server</Button>
                </div>
            </form>
        </div>
    </div>
  );
};