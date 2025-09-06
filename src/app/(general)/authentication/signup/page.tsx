import React from "react";
import SignupForm from "./component/SignupForm";

const SignupPage = () => {
  return (
    <div className="min-h-screen text-gray-900 dark:text-white overflow-hidden">
      <div className="relative min-h-screen max-w-5xl mx-auto py-[4rem] md:px-10 px-4">
        {/* Left Side - Signup Form */}

        <div className="flex gap-x-[4vw]">
          <div className="flex-1 flex items-center justify-center md:max-w-xl md:mx-auto sm:px-6 md:px-0">
            <div className="w-full space-y-8">
              {/* Signup Form */}
              <SignupForm />

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 text-gray-500 dark:text-gray-400">
                      Already have an account?
                    </span>
                  </div>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <a
                  href={`/authentication/signin`}
                  className="font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Sign in to your account
                  <span className="text-blue-600 dark:text-blue-400 ml-1">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
