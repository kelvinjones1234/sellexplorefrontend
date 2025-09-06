import Image from "next/image";

const SellerPainPoint = () => {
  return (
    <section className="relative z-10 max-w-[1200px] top-[10rem] mx-auto px-4 sm:px-6">
      <div className="px-4 carousel-section">
        <div className="relative">
          <h1 className="text-[clamp(2rem,6.5vw,3.5rem)] leading-[clamp(2.2rem,7vw,4rem)] font-semibold py-4 text-center">
            All you need to <br />
            <span className="text-[var(--color-primary)]">sell and grow</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-[5rem] mt-5">
            <div className="flex flex-col md:flex-col-reverse items-center">
              <div className="rounded-[3rem] w-full bg-[var(--card-bg-1)] text-[var(--card-text-1)] p-8 overflow-hidden">
                {/* Image Section */}
                <div className="float-left">
                  <Image
                    src="/illust.png"
                    alt="E-commerce showcase"
                    width={120}
                    height={120}
                    className="object-contain rounded-[3rem]"
                    priority
                  />
                </div>

                {/* Text Section */}
                <div>
                  <h2 className="text-2xl py-4 font-semibold text-[var(--color-text)]">
                    Sell Smarter, Grow Faster
                  </h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Manage your products, track orders, and get paid
                    effortlessly. Get everything you need to grow your sales
                    faster online.
                  </p>
                </div>
              </div>
              <div className="h-[3rem] border-dashed border-x-2 w-[10rem] border-[var(--card-text-1)]" />
              <div className="w-full h-[25rem] relative">
                <Image
                  src="/image1.jpg"
                  alt="E-commerce showcase"
                  fill
                  className="object-cover rounded-[3rem]"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-[3rem] w-full bg-[var(--card-bg-2)] text-[var(--card-text-2)] p-8 overflow-hidden">
                {/* Image Section */}
                <div className="float-left">
                  <Image
                    src="/illust1.png"
                    alt="E-commerce showcase"
                    width={120}
                    height={120}
                    className="object-contain rounded-[3rem]"
                    priority
                  />
                </div>

                {/* Text Section */}
                <div>
                  <h2 className="text-2xl py-4 font-semibold text-[var(--color-text)]">
                    Stay on Top of Orders & Customer Activity
                  </h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Manage your products, track orders, and get paid
                    effortlessly. Get everything you need to grow your sales
                    faster online.
                  </p>
                </div>
              </div>
              <div className="h-[3rem] border-dashed border-x-2 w-[10rem] border-[var(--card-text-2)]" />
              <div className="w-full h-[25rem] relative">
                <Image
                  src="/image3.jpg"
                  alt="E-commerce showcase"
                  fill
                  className="object-cover rounded-[3rem]"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-col-reverse items-center">
              <div className="rounded-[3rem] w-full bg-[var(--card-bg-3)] text-[var(--card-text-3)] p-8 overflow-hidden">
                {/* Image Section */}
                <div className="float-left">
                  <Image
                    src="/illust3.png"
                    alt="E-commerce showcase"
                    width={120}
                    height={120}
                    className="object-contain rounded-[3rem]"
                    priority
                  />
                </div>

                {/* Text Section */}
                <div>
                  <h2 className="text-2xl py-4 font-semibold text-[var(--color-text)]">
                    Receive payments without hassle
                  </h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Open a free bank account, accept payments in multiple ways,
                    and generate professional invoices effortlessly.
                  </p>
                </div>
              </div>
              <div className="h-[3rem] border-dashed border-x-2 w-[10rem] border-[var(--card-text-3)]" />
              <div className="w-full h-[25rem] relative">
                <Image
                  src="/image4.jpg"
                  alt="E-commerce showcase"
                  fill
                  className="object-cover rounded-[3rem]"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-[3rem] w-full bg-[var(--card-bg-4)] text-[var(--card-text-4)] p-8 overflow-hidden">
                {/* Image Section */}
                <div className="float-left">
                  <Image
                    src="/illust6.png"
                    alt="E-commerce showcase"
                    width={120}
                    height={120}
                    className="object-contain rounded-[3rem]"
                    priority
                  />
                </div>

                {/* Text Section */}
                <div>
                  <h2 className="text-2xl py-4 font-semibold text-[var(--color-text)]">
                    Get product analytics and insight
                  </h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Open a free bank account, accept payments in multiple ways,
                    and generate professional invoices effortlessly.
                  </p>
                </div>
              </div>
              <div className="h-[3rem] border-dashed border-x-2 w-[10rem] border-[var(--card-text-4)]" />
              <div className="w-full h-[25rem] relative">
                <Image
                  src="/image6.jpg"
                  alt="E-commerce showcase"
                  fill
                  className="object-cover rounded-[3rem]"
                  priority
                />
              </div>
            </div>
          </div>
          {/* <div className="overflow-hidden relative w-full h-[100vh]">
                  <AnimatedImageCarousel />
                </div> */}

          {/* Floating Stats Cards */}
          {/* <div className="absolute -right-4 top-16 bg-[var(--color-surface)] rounded-lg shadow-lg border border-[var(--color-border)] p-2 w-32 no-color-transition">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      +285%
                    </div>
                    <div className="text-xs ">Sales Growth</div>
                  </div>
                </div>

                <div className="absolute -left-4 bottom-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg p-2 w-36 no-color-transition">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">98.7%</div>
                    <div className="text-xs">Customer Satisfaction</div>
                  </div>
                </div>

                <div className="absolute right-2 bottom-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg p-2 w-28 no-color-transition">
                  <div className="text-center">
                    <TrendingUp className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                    <div className="text-sm font-bold text-purple-600">
                      Live
                    </div>
                    <div className="text-xs ">Analytics</div>
                  </div>
                </div> */}
        </div>
      </div>
    </section>
  );
};

export default SellerPainPoint;
