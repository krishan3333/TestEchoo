// app/hooks/use-modal-store.ts
import { create } from 'zustand';

// Define the types of modals you have
export type ModalType = "createServer" | "joinServer" | "createChannel"; // Added createChannel example

// Define potential data needed by modals (optional)
interface ModalData {
  serverId?: string;
  onSuccess?: (newServer?: any) => void; // Example: Needed for createChannel
  // Add other data props as needed for different modals
}

// Define the state structure for the modal store
interface ModalState {
  type: ModalType | null; // Which modal is open, or null
  data: ModalData; // Data passed to the modal
  isOpen: boolean; // Is any modal open?
  onOpen: (type: ModalType, data?: ModalData) => void; // Function to open a modal
  onClose: () => void; // Function to close the current modal
}

// Create the Zustand store
export const useModal = create<ModalState>((set) => ({
  type: null,
  data: {}, // Initial data is empty
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }), // Set type, data, and open state
  onClose: () => set({ type: null, isOpen: false, data: {} }), // Reset type, data, and close state
}));