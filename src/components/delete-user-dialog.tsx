"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteUser } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteUserDialogProps = {
  userId: string;
  userName: string | null;
  userEmail: string | null;
};

export function DeleteUserDialog({
  userId,
  userName,
  userEmail,
}: DeleteUserDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const label = userName ?? userEmail ?? "this user";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isPending) return;
        setOpen(next);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="rounded-lg disabled:pointer-events-none"
          disabled={isPending}
          aria-busy={isPending}
          aria-label={`Delete ${label}`}
        >
          {isPending ? (
            <>
              <Loader2
                className="size-3.5 shrink-0 animate-spin"
                aria-hidden
              />
              Delete
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onEscapeKeyDown={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">{label}</span> from the
            database. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            className="disabled:pointer-events-none"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            aria-busy={isPending}
            className="min-w-[8.25rem] disabled:pointer-events-none"
            onClick={() => {
              startTransition(async () => {
                try {
                  const fd = new FormData();
                  fd.set("id", userId);
                  const result = await deleteUser(fd);

                  if (!result.ok) {
                    toast.error(result.error);
                    return;
                  }

                  toast.success("User deleted");
                  setOpen(false);
                  router.refresh();
                } catch (e) {
                  const message =
                    e instanceof Error
                      ? e.message
                      : "Delete failed unexpectedly.";
                  toast.error(message);
                }
              });
            }}
          >
            {isPending ? (
              <>
                <Loader2
                  className="size-4 shrink-0 animate-spin"
                  aria-hidden
                />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
