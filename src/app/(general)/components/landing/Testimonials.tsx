import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Boutique Owner",
      content:
        "Increased my sales by 340% in just 3 months. The WhatsApp integration is a game-changer.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Electronics Retailer",
      content:
        "Finally, a platform that understands what sellers actually need. Setup took 10 minutes.",
      rating: 5,
    },
  ];

  return (
    <div className="w-full overflow-hidden">
     
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-9">
        <h2 className="text-4xl font-bold text-center mb-12">
          Trusted by Industry Leaders
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-8 ring shadow-xl ring-gray-900/5 dark:ring-gray-700/20"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 italic">
                &quot;{testimonial.content}&quot;
              </p>
              <div>
                <div className="text-gray-900 dark:text-white font-semibold">
                  {testimonial.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
