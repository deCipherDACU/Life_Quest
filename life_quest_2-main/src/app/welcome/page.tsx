
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import AppLogo from '@/components/layout/AppLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, User as UserIcon, Check, Swords, Palette, Brain, Heart } from 'lucide-react';
import StepWelcome from '@/components/welcome/StepWelcome';
import StepName from '@/components/welcome/StepName';
import StepAvatar from '@/components/welcome/StepAvatar';
import StepInterests from '@/components/welcome/StepInterests';
import StepMbti from '@/components/welcome/StepMbti';
import StepReady from '@/components/welcome/StepReady';
import StepGender from '@/components/welcome/StepGender';
import type { User } from '@/lib/types';

const steps = [
  { id: 'welcome', component: StepWelcome, icon: AppLogo },
  { id: 'name', component: StepName, icon: UserIcon },
  { id: 'avatar', component: StepAvatar, icon: Palette },
  { id: 'gender', component: StepGender, icon: Heart },
  { id: 'interests', component: StepInterests, icon: Swords },
  { id: 'mbti', component: StepMbti, icon: Brain },
  { id: 'ready', component: StepReady, icon: Check },
];

export default function WelcomePage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [mbti, setMbti] = useState('');
  const [gender, setGender] = useState<User['gender']>('prefer-not-to-say');

  const handleNext = () => {
    if (user) {
      if (currentStep === 1) { // After name step
        setUser({ ...user, name });
      }
      if (currentStep === 2) { // After avatar step
          const avatarUrl = `https://picsum.photos/seed/element-${avatar}/200/200`;
          setUser({ ...user, avatarUrl: avatarUrl });
      }
      if (currentStep === 3) { // After gender step
        setUser({ ...user, gender });
      }
      if (currentStep === 5) { // After mbti step
        setUser({ ...user, mbti: mbti });
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    if (currentStep >= 5) { // from mbti or ready step
        router.push('/dashboard');
    } else {
        setCurrentStep(5); // skip to mbti
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-xl">
        <Card>
          <CardContent className="p-4 sm:p-8">
            <div className='flex justify-center mb-4'>
                 <AppLogo />
            </div>
            <Progress value={progress} className="mb-8 h-2" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentStepComponent
                  name={name}
                  setName={setName}
                  avatar={avatar}
                  setAvatar={setAvatar}
                  mbti={mbti}
                  setMbti={setMbti}
                  gender={gender}
                  setGender={setGender}
                />
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between items-center">
              <div>
                {currentStep > 0 && currentStep < steps.length - 1 && (
                  <Button variant="ghost" onClick={handleSkip}>
                    {currentStep < 5 ? 'Skip' : 'Skip for now'}
                  </Button>
                )}
              </div>
              <Button onClick={handleNext} size="lg" disabled={currentStep === 1 && !name}>
                {currentStep === steps.length - 1 ? 'Start Your Adventure!' : 'Continue'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
