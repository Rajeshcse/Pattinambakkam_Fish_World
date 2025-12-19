import React, { useEffect } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';

export const Register: React.FC = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const logTokenOnSignUp = async () => {
      try {
        const token = await getToken();
        if (token) {
          console.log('✅ Bearer Token:', token);
          console.log('🎉 User registered successfully!');
        }
      } catch (error) {
        console.log('Not signed in yet');
      }
    };

    logTokenOnSignUp();
  }, [getToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <SignUp
          forceRedirectUrl="/profile"
          signInUrl="/login"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
              card: 'bg-white shadow-md',
            },
          }}
        />
      </div>
    </div>
  );
};
