
'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import type { RewardItem } from "@/lib/types";
import { useForm } from "react-hook-form";

type CreateRewardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormValues = {
    title: string;
    description: string;
    coinCost: number;
};

export function CreateRewardDialog({ open, onOpenChange }: CreateRewardDialogProps) {
    const { addCustomReward } = useUser();
    const { register, handleSubmit, reset } = useForm<FormValues>();
    
    const onSubmit = (data: FormValues) => {
        addCustomReward({
            ...data,
            coinCost: Number(data.coinCost),
        });
        handleClose();
    }

    const handleClose = () => {
        onOpenChange(false);
        reset();
    }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Create Custom Reward</DialogTitle>
          <DialogDescription>
            Add a personal reward that you can redeem with your coins.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                  Title
                  </Label>
                  <Input id="title" placeholder="e.g., 30 Mins of Youtube" className="col-span-3" {...register("title", { required: true })} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                  Description
                  </Label>
                  <Textarea id="description" placeholder="Optional details" className="col-span-3" {...register("description")} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="coinCost" className="text-right">
                  Coin Cost
                  </Label>
                   <Input id="coinCost" type="number" placeholder="e.g. 100" className="col-span-3" {...register("coinCost", { required: true, valueAsNumber: true })} />
              </div>
            </div>
            <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create Reward</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
