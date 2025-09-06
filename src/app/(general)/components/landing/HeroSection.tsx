"use client";
import React, { useState, useEffect } from "react";
import GetStartedButton from "./GetStartedButton";
import FeatureSlider from "./FeatureSlider";

const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const socialPlatforms = ["facebook", "twitter", "whatsapp", "social media"];

  // Typewriter effect
  useEffect(() => {
    const handleTyping = () => {
      const currentWord = socialPlatforms[currentWordIndex];

      if (!isDeleting) {
        // Typing
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        setTypingSpeed(100 + Math.random() * 100); // Vary typing speed for natural feel

        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000); // Pause at complete word
          return;
        }
      } else {
        // Deleting
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        setTypingSpeed(50);

        if (displayText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % socialPlatforms.length);
          setTypingSpeed(500); // Pause before typing next word
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex, typingSpeed]);

  return (
    <section className="relative h-auto top-[5rem]">
      {/* Enhanced styles for animations */}
      <style jsx>{`
        .no-color-transition {
          transition: none !important;
        }
        [data-theme] .no-color-transition,
        [data-theme] .no-color-transition * {
          transition: none !important;
        }

        .fade-in {
          animation: fadeInUp 1.2s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .fade-in-delayed {
          animation: fadeInUp 1.2s ease-out 0.3s forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .fade-in-more-delayed {
          animation: fadeInUp 1.2s ease-out 0.6s forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .typewriter {
          position: relative;
          display: inline-block;
        }

        .typewriter::after {
          content: "|";
          display: inline-block;
          animation: blink 1s infinite;
          color: var(--color-primary);
          margin-left: 2px;
        }

        .social-text {
          color: var(--color-primary);
          position: relative;
          min-width: 140px;
          display: inline-block;
          text-align: left;
        }

        .hero-title {
          color: var(--color-text);
        }

        .hero-subtitle {
          animation: slideInFromBottom 1s ease-out 0.8s forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .cta-button {
          animation: scaleIn 0.8s ease-out 1.2s forwards;
          opacity: 0;
          transform: scale(0.8);
        }

        .carousel-section {
          animation: fadeInUp 1.2s ease-out 1.5s forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromBottom {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        .floating {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-in,
          .fade-in-delayed,
          .fade-in-more-delayed,
          .hero-subtitle,
          .cta-button,
          .floating,
          .carousel-section {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="">
        <div className="relative flex flex-col">
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <div className="mx-auto text-center">
              <div className="no-color-transition container-padding">
                <h1
                  className={`text-[clamp(2.2rem,7vw,4rem)] font-light leading-[clamp(2.5rem,7.5vw,4.5rem)] mb-6 hero-title fade-in`}
                >
                  Get found on <br />
                  <span className="font-bold fade-in-delayed">google</span> and
                  Sell <br />
                  easily on{" "}
                  <span className="font-bold typewriter social-text fade-in-more-delayed">
                    {displayText}
                  </span>
                </h1>

                <p className=" text-[clamp(1rem,2vw,1.5rem)] mx-auto max-w-[500px] lg:max-w-[700px] hero-subtitle">
                  If customers can't find you online, your business is
                  invisible. Put your brand on Google with a professional
                  website and a product catalog that makes buying effortless.
                </p>

                <div className="w-full flex justify-center mt-10 cta-button">
                  <div className="">
                    <GetStartedButton />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <FeatureSlider />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
