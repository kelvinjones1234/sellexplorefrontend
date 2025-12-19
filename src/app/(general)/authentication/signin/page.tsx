import React from "react";
import SigninForm from "./component/SigninForm";

const SignupPage = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="relative z-10 min-h-screen max-w-5xl mx-auto py-[4rem] md:px-10 px-4">
        <div className="flex gap-x-[4vw]">
          <div className="flex-1 flex items-center justify-center md:max-w-xl md:mx-auto sm:px-6 md:px-0">
            <div className="w-full space-y-8">
              {/* Signup Form */}
              <SigninForm />
              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--color-border-default)]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                      Don&apos;t have an account?
                    </span>
                  </div>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <a
                  href={`/authentication/signup`}
                  className="font-medium hover:text-[var(--color-brand-hover)] text-[var(--color-text-primary)]"
                >
                  Create your account
                  <span className="text-[var(--color-primary)] ml-1">→</span>
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
