import { cn } from '@/lib/utils';
import { Sword } from 'lucide-react';

const AppLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div className="bg-primary rounded-lg p-2">
        <Sword className="text-primary-foreground h-6 w-6" />
      </div>
      <span className="text-xl font-headline font-bold text-foreground">
        LifeQuest
      </span>
    </div>
  );
};

export default AppLogo;
