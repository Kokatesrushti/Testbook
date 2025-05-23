export default function StatsCounter() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-lg bg-primary-light">
            <div className="text-3xl font-bold text-primary mb-2">200K+</div>
            <div className="text-neutral-600">Active Students</div>
          </div>
          <div className="p-6 rounded-lg bg-neutral-100">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-neutral-600">Expert Educators</div>
          </div>
          <div className="p-6 rounded-lg bg-primary-light">
            <div className="text-3xl font-bold text-primary mb-2">1000+</div>
            <div className="text-neutral-600">Practice Tests</div>
          </div>
          <div className="p-6 rounded-lg bg-neutral-100">
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-neutral-600">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
