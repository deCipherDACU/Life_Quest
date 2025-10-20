
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateBossImage } from '@/ai/flows/generate-boss-image';
import { Loader2, Wand2 } from 'lucide-react';
import Image from 'next/image';

type GenerateImageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageGenerated: (imageUrl: string) => void;
};

export function GenerateImageDialog({ open, onOpenChange, onImageGenerated }: GenerateImageDialogProps) {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('A powerful anime-style demon warrior, with glowing red eyes and dark armor, holding a massive flaming sword, in a desolate wasteland under a stormy sky, cinematic lighting, wide shot');
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    
    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedImage(null);
        try {
            const result = await generateBossImage({ prompt });
            setGeneratedImage(result.imageUrl);

            if (result.isPlaceholder) {
                toast({
                    title: "Image Generation Failed",
                    description: "Could not generate an image due to service limits. A placeholder is being used instead.",
                    variant: "destructive",
                });
            } else {
                 toast({
                    title: "Image Generated!",
                    description: "A new boss image has been created.",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error Generating Image',
                description: 'Could not generate image. Please try again.',
                variant: 'destructive',
            });
        }
        setLoading(false);
    }

    const handleConfirm = () => {
        if (generatedImage) {
            onImageGenerated(generatedImage);
        }
        onOpenChange(false);
        setGeneratedImage(null);
    }
    
    const handleClose = () => {
        onOpenChange(false);
        setGeneratedImage(null);
    }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Generate Boss Image</DialogTitle>
          <DialogDescription>
            Describe the boss you want to generate. Be specific for the best results.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea 
                    id="prompt" 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    placeholder="e.g., A giant cyborg dragon..."
                    rows={4}
                />
            </div>
            {loading && (
                <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {generatedImage && (
                <div className="relative h-48 w-full">
                    <Image src={generatedImage} alt="Generated boss" layout="fill" objectFit="contain" className="rounded-lg" />
                </div>
            )}
        </div>
        <DialogFooter className='sm:justify-between gap-2'>
          <Button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button type="button" onClick={handleConfirm} disabled={!generatedImage}>
                Use This Image
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
