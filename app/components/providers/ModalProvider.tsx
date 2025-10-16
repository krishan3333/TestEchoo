"use client";

import { useEffect, useState } from "react";
import { CreateServerModal } from "@/app/components/modals/CreateServerModal";
import { JoinServerModal } from "../modals/JoinServerModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <JoinServerModal />
    </>
  );
};