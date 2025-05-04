
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const ThankYouMessage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className={isMobile ? "px-3 py-3" : undefined}>
        <CardTitle className="text-lg sm:text-xl font-semibold text-survey-dark dark:text-gray-100">
          Merci pour votre participation
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 py-3" : undefined}>
        <div className="text-center py-6">
          <p className="text-lg mb-4">
            Nous vous remercions d'avoir pris le temps de répondre à notre sondage.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Vos réponses sont précieuses pour notre recherche sur le crédit d'investissement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThankYouMessage;
