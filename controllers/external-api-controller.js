const axios = require("axios");

exports.getLacrosseData = async (req, res, next) => {
  try {
    const response = await axios.get("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=National%20Lacrosse%20League");
    const teams = response.data.teams || [];

    res.render("external-api", {
      pageTitle: "Lacrosse API",
      pageClass: "external-api-page",
      teams
    });
  } catch (err) {
    console.error("API Fetch Error:", err.message);
    next(err);
  }
};
