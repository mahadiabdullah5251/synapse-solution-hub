const useCases = [
  {
    industry: "Healthcare",
    title: "AI-Guided Diagnosis",
    description: "Improve patient outcomes with AI-powered diagnostic assistance.",
  },
  {
    industry: "Finance",
    title: "Automated Wealth Management",
    description: "Optimize investment strategies with AI-driven portfolio management.",
  },
  {
    industry: "Education",
    title: "Personalized Learning",
    description: "Create custom learning paths adapted to individual student needs.",
  },
  {
    industry: "Agriculture",
    title: "Smart Farming",
    description: "Maximize crop yields with AI-powered agricultural insights.",
  },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="py-20 bg-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Industry Solutions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-sm font-semibold text-accent mb-2">{useCase.industry}</div>
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-gray-600">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;