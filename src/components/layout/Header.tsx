
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  isAdmin?: boolean;
}

const Header: FC<HeaderProps> = ({ isAdmin = false }) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm dark:bg-gray-800 dark:text-gray-100">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0">
          <h1 className={`text-xl font-semibold text-survey-dark dark:text-white text-center sm:text-left ${isMobile ? 'w-full mx-auto' : ''}`}>
            {isAdmin ? "Tableau de Bord Administrateur" : "Sondage"}
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className={`transition-colors hover:text-survey-primary ${
                  !isAdmin ? 'text-survey-primary font-medium' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Sondage
              </Link>
            </li>
            <li>
              <Link 
                to="/admin" 
                className={`transition-colors hover:text-survey-primary ${
                  isAdmin ? 'text-survey-primary font-medium' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Administration
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <Separator className="mt-4" />
    </header>
  );
};

export default Header;
