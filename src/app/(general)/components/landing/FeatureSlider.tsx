import React from "react";

interface Feature {
  id: number;
  title: string;
  description: string;
}

const features: Feature[] = [
  { id: 1, title: "500+ Sold", description: "Trusted by happy customers" },
  { id: 2, title: "Top Quality", description: "Premium fabrics & stitching" },
  { id: 3, title: "Fast Delivery", description: "Nationwide shipping in 24h" },
  { id: 4, title: "Easy Returns", description: "Hassle-free process" },
  { id: 5, title: "Secure Payments", description: "Multiple payment options" },
];

export default function FeatureSlider() {
  const duplicatedFeatures = [...features, ...features]; // seamless loop

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        
        :root {
          --color-bg: #f8fafc;
          --color-surface: #ffffff;
          --color-shadow: rgba(0, 0, 0, 0.1);
          --color-border: #e2e8f0;
          --color-text: #1e293b;
          --color-text-secondary: #64748b;
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden py-3"
        style={{ backgroundColor: "var(--color-bg-surface)" }}
      >
        <div className="flex w-max animate-marquee">
          {duplicatedFeatures.map((feature, index) => (
            <div
              key={`${feature.id}-${index}`}
              className="mx-3 flex-shrink-0 min-w-[250px] rounded-full p-2 text-center shadow-md transition-transform duration-300 hover:scale-105"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                boxShadow: `0 4px 6px -1px var(--color-shadow)`,
                border: `1px solid var(--color-border-default)`,
              }}
            >
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {feature.title}
              </h3>
              {/* <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {feature.description}
              </p> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
