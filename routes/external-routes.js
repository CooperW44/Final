const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/externalapi', async (req, res) => {
  try {
    const apiUrl = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=National%20Lacrosse%20League';
    const response = await axios.get(apiUrl);
    const teams = response.data.teams;
    res.render('external-api', {
      pageTitle: 'Lacrosse Teams',
      pageClass: 'external-api-page',
      teams
    });
  } catch (error) {
    console.error("API Fetch Error:", error);
    res.render('external-api', {
      pageTitle: 'Lacrosse Teams',
      pageClass: 'external-api-page',
      teams: []
    });
  }
});

module.exports = router;
