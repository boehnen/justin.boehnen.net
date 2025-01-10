// const textArray = [
//   ["Crafting .NET solutions.", 2000],
//   ["Building modern web apps.", 2000],
//   ["Innovating in the cloud.", 2000],
//   ["Leveraging CI/CD pipelines.", 2000],
//   ["Designing scalable architectures.", 2000],
//   ["Design maintainability.", 2000],
//   ["Fusing code quality with creativity.", 2000],
//   ["Optimizing for performance at scale.", 2000],
//   ["Optimizing for reliabilityat sca", 700],   // Short display (typo)
//   ["Optimizing for reliability at scale.", 1500],
//   ["⛅ 💻 🚀", 3000]
// ];

export const phrases = [
    {
      words: [
        { text: "Crafting"},
        { text: ".NET", typingFactor: 4 },
        { text: "solutions." }
      ],
      lifespan: 2000
    },
    {
      words: [
        { text: "Crafting" },
        { text: "modern", pauseBefore: 170 },
        { text: "web" },
        { text: "apps." },
      ],
      lifespan: 2000
    },
    {
      words: [
        { text: "Innovating" },
        { text: "in" },
        { text: "the" },
        { text: "cloud." },
      ],
      lifespan: 2000
    },
    {
      words: [
        { text: "Leveraging" },
        { text: "CI/CD", typingFactor: 2.5 },
        { text: "pipelines." }
      ],
      lifespan: 2000
    },
    {
      words: [
        { text: "Designing" },
        { text: "scalable" },
        { text: "architectures." }
      ],
      lifespan: 2000
    },
    {
      words: [
        { text: "Designing" },
        { text: "maintainability.", pauseBefore: 170 }
      ],
      lifespan: 2000
    },
    {
      words: [
        { text: "Fusing" },
        { text: "code" },
        { text: "quality" },
        { text: "with" },
        { text: "creativity." }
      ],
      lifespan: 2000
    },
    {
      words: [
        { text: "Optimizing" },
        { text: "for" },
        { text: "performance" },
        { text: "at" },
        { text: "scale." }
      ],
      lifespan: 2000
    },
    {
      words: [
        { text: "Optimizing" },
        { text: "for" },
        { text: "reliabilityat", pauseBefore: 170 },
        { text: "sca", typingFactor: 2 }
      ],
      lifespan: 0
    },
    {
      words: [
        { text: "Optimizing" },
        { text: "for" },
        { text: "reliability" },
        { text: "at" },
        { text: "scale." }
      ],
      lifespan: 1500
    },
    {
      words: [
        { text: "⛅", pauseAfter: 370 },
        { text: "💻", pauseAfter: 370 },
        { text: "🚀" }
      ],
      lifespan: 2000
    }
  ];