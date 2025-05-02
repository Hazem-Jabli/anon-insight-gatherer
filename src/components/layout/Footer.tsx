
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="w-full py-4 px-6 bg-gray-50 border-t dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300">
      <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Ce sondage est complètement anonyme et privé. Aucune information personnelle identifiable n'est collectée.
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} Plateforme de sondage axée sur la confidentialité - <span className="font-bold">Hazem Jabli</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
