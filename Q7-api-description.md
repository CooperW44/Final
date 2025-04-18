<!--- Write a description of the external API you implemented for question 7 here.  No special formatting is required; however, if desired you can use the basic markdown syntax (https://www.markdownguide.org/cheat-sheet/) and view the result by right-clicking the file and selecting 'Open Preview'. -->


External API: Lacrosse Teams from TheSportsDB

API Source: [TheSportsDB - Free Sports API](https://www.thesportsdb.com/api.php)

*API Endpoint Used
https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=National%20Lacrosse%20League

What does it do?
This endpoint returns all teams in the National Lacrosse League (NLL), including team names, stadiums, countries, and logos. The data is fetched with Axios and rendered into a dynamic page using EJS (`external-api.ejs`).
