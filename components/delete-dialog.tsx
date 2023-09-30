import supabase from "@/supabase/supabase-client";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { mutate } from "swr";

export const DeleteDialog = ({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id?: number | undefined | null;
}) => {
  const toast = useToast();
  const cancelRef = React.useRef();

  const [isLoading, setIsLoading] = React.useState(false);

  const onDelete = async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("alterations").delete().eq("id", +id);

    if (error) {
      toast({
        title: "Error deleting ticket.",
        description: "There was an error deleting your ticket.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    mutate("/api/alterations");
    toast({
      title: "Ticket deleted.",
      description: "We've deleted your ticket.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    setIsLoading(false);
    onClose();
  };

  if (!id) {
    return null;
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef as any}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Alteration
          </AlertDialogHeader>

          <AlertDialogBody>
            {` Are you sure? You can't undo this action afterwards.`}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef as any} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => onDelete()}
              ml={3}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
