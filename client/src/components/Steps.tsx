function Steps() {
  const steps = [
    {
      title: "Describe Your Vision",
      description:
        "Write a text prompt describing the image you want to create.",
    },
    {
      title: "Watch the Magic Happen",
      description:
        "Our AI instantly generates a unique image based on your description.",
    },
    {
      title: "Download & Share",
      description:
        "Save your image and share it with the world or on your projects.",
    },
  ];

  return (
    <section className="py-20 w-full flex flex-col items-center text-center px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-black">
        How It Works
      </h2>

      <div className="flex flex-col md:flex-row md:justify-between gap-10 max-w-5xl w-full">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center md:items-start text-center md:text-left bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white font-bold text-lg mb-4">
              {index + 1}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-black">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Steps;
