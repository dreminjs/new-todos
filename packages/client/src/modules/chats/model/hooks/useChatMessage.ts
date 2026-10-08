import { useParams } from "react-router";
import { useCreateChatMessage, useUpdateChatMessage } from "../../api/queries";
import { useChatStore } from "../chat.store";
import { useForm } from "react-hook-form";
import type { TCreateChatMessageFormDto } from "../chats.types";

export const useChatMessage = (
  fileInputRef: React.RefObject<HTMLInputElement>,
  initialContent: string,
) => {
  const { chatId, workspaceId } = useParams<{
    chatId: string;
    workspaceId: string;
  }>();
  const { mutate: createMessage, isPending: isPendingCreateMessage } =
    useCreateChatMessage({ chatId: chatId!, workspaceId: workspaceId! });
  const { mutate: updateMessage, isPending: isPendingUpdateMessage } =
    useUpdateChatMessage({ chatId: chatId!, workspaceId: workspaceId! });

  const { register, handleSubmit, watch, setValue, reset } =
    useForm<TCreateChatMessageFormDto>({
      defaultValues: {
        content: initialContent,
      },
    });

  const editMessageId = useChatStore((state) => state.editMessageId);
  const setEditMessageId = useChatStore((state) => state.onSetEditMessageId);

  const isPending = isPendingCreateMessage || isPendingUpdateMessage;

  const files = watch("files") ?? [];

  const currentContent = watch("content");

  const handleRemoveFile = (indexToRemove: number) => {
    setValue(
      "files",
      files.filter((_, idx) => idx !== indexToRemove),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const handleAddFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;
    setValue("files", [...files, ...Array.from(newFiles)], {
      shouldDirty: true,
      shouldTouch: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: TCreateChatMessageFormDto) => {
    const trimmed = data.content.trim();
    if ((!trimmed && data.files.length === 0) || isPending) return;

    if (editMessageId) {
      updateMessage(
        { content: trimmed, id: editMessageId },
        {
          onSettled: () => {
            reset({ content: "", files: [] });
            setEditMessageId(null);
          },
        },
      );
    } else {
      if (data.files && data.files.length > 0) {
        const formData = new FormData();

        data.files.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("content", trimmed);
        createMessage(formData, {
          onSettled: () => {
            reset({ content: "", files: [] });
          },
        });
      } else {
        createMessage(
          { content: trimmed },
          {
            onSettled: () => {
              reset({ content: "", files: [] });
            },
          },
        );
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const isSubmitDisabled = !currentContent?.trim() || isPending;

  return {
    onKeyDown: handleKeyDown,
    isPending,
    onAddFiles: handleAddFiles,
    onRemoveFile: handleRemoveFile,
    register,
    onSubmit,
    handleSubmit,
    currentContent,
    isSubmitDisabled,
    files,
  };
};
