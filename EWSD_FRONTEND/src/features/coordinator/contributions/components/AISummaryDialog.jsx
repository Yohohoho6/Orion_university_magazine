import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AISummary } from "@/features/student/contributions/components/AISummary";

export function AISummaryDialog({ isOpen, onOpenChange, contribution }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              AI Summary
            </ModalHeader>
            <ModalBody className="max-h-[60vh] overflow-y-auto">
              {contribution && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    {contribution.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    by {contribution.user?.name || "Unknown"}
                  </p>
                </div>
              )}

              {contribution?.id && (
                <AISummary contributionId={contribution.id} showTitle={false} />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="solid" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}