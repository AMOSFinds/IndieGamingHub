export default async function handler(req, res) {
  const { demoUrl } = req.body;
  // Mock AI logic (replace with Hugging Face later)
  const insights = [
    "50% quit early—too complex?",
    "Game feels slow after 1 minute",
    "Players engaged for 90%—great retention!",
    "Interface unclear—consider simplifying",
  ];
  const report = {
    score: Math.floor(Math.random() * 100),
    insights: [insights[Math.floor(Math.random() * insights.length)]],
  };
  res.status(200).json(report);
}
