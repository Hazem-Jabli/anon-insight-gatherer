
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="w-full py-4 px-6 bg-gray-50 border-t">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>
          This survey is completely anonymous and private. No personal identifying information is collected.
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} Privacy-Focused Survey Platform
        </p>
      </div>
    </footer>
  );
};

export default Footer;
