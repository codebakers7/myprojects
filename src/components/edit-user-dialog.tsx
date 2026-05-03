"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateUser } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fieldClass =
  "h-11 rounded-xl border-slate-200 bg-slate-50/80 px-4 text-base shadow-inner shadow-slate-200/40 transition-[box-shadow,border-color,background-color] placeholder:text-slate-400 hover:bg-white focus-visible:bg-white focus-visible:shadow-md md:text-[0.95rem]";

type EditUserDialogProps = {
  userId: string;
  userName: string | null;
  userEmail: string | null;
};

export function EditUserDialog({
  userId,
  userName,
  userEmail,
}: EditUserDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(userName ?? "");
  const [email, setEmail] = useState(userEmail ?? "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setName(userName ?? "");
      setEmail(userEmail ?? "");
    }
  }, [open, userName, userEmail]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await updateUser(userId, name, email);

        if (!result.ok) {
          toast.error(result.error);
          return;
        }

        toast.success("User updated");
        setOpen(false);
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Update failed unexpectedly.";
        toast.error(message);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isPending) return;
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="rounded-lg">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update name and email. Changes sync to your database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor={`edit-name-${userId}`} className="text-slate-700">
                Name
              </Label>
              <Input
                id={`edit-name-${userId}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                disabled={isPending}
                className={fieldClass}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={`edit-email-${userId}`}
                className="text-slate-700"
              >
                Email
              </Label>
              <Input
                id={`edit-email-${userId}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isPending}
                className={fieldClass}
                placeholder="jane@example.com"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end sm:gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[7rem]">
              {isPending ? (
                <>
                  <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
