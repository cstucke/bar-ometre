export async function getHealth(req, res) {
  res.json({
    data: {
      status: "ok",
      service: "bar-ometre-api",
    },
  });
}
