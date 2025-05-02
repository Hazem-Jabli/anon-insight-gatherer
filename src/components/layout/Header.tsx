
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface HeaderProps {
  isAdmin?: boolean;
}

const Header: FC<HeaderProps> = ({ isAdmin = false }) => {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-survey-dark">
            {isAdmin ? "Survey Admin Dashboard" : "Investment Credit Survey"}
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className={`transition-colors hover:text-survey-primary ${
                  !isAdmin ? 'text-survey-primary font-medium' : 'text-gray-600'
                }`}
              >
                Survey
              </Link>
            </li>
            <li>
              <Link 
                to="/admin" 
                className={`transition-colors hover:text-survey-primary ${
                  isAdmin ? 'text-survey-primary font-medium' : 'text-gray-600'
                }`}
              >
                Admin
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
