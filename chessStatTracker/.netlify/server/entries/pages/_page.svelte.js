import { c as create_ssr_component, d as subscribe, a as add_attribute } from "../../chunks/ssr.js";
import "../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
import { w as writable } from "../../chunks/index2.js";
const logo = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2098%20147'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;'%3e%3cg%20transform='matrix(1,0,0,1,-462.633,-804.474)'%3e%3cg%20transform='matrix(1,0,0,1,-87.3988,343.836)'%3e%3crect%20x='589.559'%20y='460.639'%20width='18.144'%20height='9.072'%20style='fill:rgb(154,0,50);'/%3e%3cg%20transform='matrix(1,0,0,1,550.032,460.638)'%3e%3crect%20x='39.527'%20y='0.001'%20width='18.144'%20height='7.775'/%3e%3c/g%3e%3c/g%3e%3cg%20transform='matrix(1,0,0,1,-85.1956,344.095)'%3e%3crect%20x='618.589'%20y='460.379'%20width='10.627'%20height='13.219'%20style='fill:rgb(154,0,50);'/%3e%3cg%20transform='matrix(1,0,0,1,547.829,460.379)'%3e%3cpath%20d='M70.76,7.776L70.76,0L81.387,0L81.387,7.776L70.76,7.776Z'/%3e%3c/g%3e%3c/g%3e%3cg%20transform='matrix(1,0,0,1,-140.145,344.095)'%3e%3crect%20x='618.589'%20y='460.379'%20width='10.627'%20height='13.219'%20style='fill:rgb(154,0,50);'/%3e%3cg%20transform='matrix(1,0,0,1,602.778,460.379)'%3e%3cpath%20d='M15.811,7.776L15.811,0L26.438,0L26.438,7.776L15.811,7.776Z'/%3e%3c/g%3e%3c/g%3e%3cg%20transform='matrix(1,0,0,0.682811,-87.01,529.222)'%3e%3crect%20x='549.643'%20y='605.788'%20width='97.198'%20height='12.182'/%3e%3c/g%3e%3cg%20transform='matrix(0.781547,0,0,0.709599,43.6779,496.947)'%3e%3crect%20x='549.643'%20y='605.788'%20width='97.198'%20height='12.182'/%3e%3c/g%3e%3cg%20transform='matrix(1,0,0,0.924729,-85.4548,379.094)'%3e%3crect%20x='563.899'%20y='468.414'%20width='65.576'%20height='40.175'/%3e%3c/g%3e%3cg%20transform='matrix(1.22755,0,0,0.753907,-222.182,469.649)'%3e%3crect%20x='575.822'%20y='512.478'%20width='43.286'%20height='84.757'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
const eventPrefix = /^on/;
const events = [];
Object.keys(globalThis).forEach((key) => {
  if (eventPrefix.test(key)) {
    events.push(key.replace(eventPrefix, ""));
  }
});
function analyzeResult(result, other) {
  if (result === "win") {
    if (other === "checkmated") return "win by checkmate";
    if (other === "timeout") return "win by timeout";
    if (other === "resigned" || other === "abandoned") return "win by resignation/abandonment";
  } else if (result === "checkmated") {
    return "loss by checkmate";
  } else if (result === "timeout") {
    return "loss by timeout";
  } else if (result === "resigned" || result === "abandoned") {
    return "loss by resignation/abandonment";
  } else if (result === "agreed") {
    return "draw by agreement";
  } else if (result === "repetition") {
    return "draw by repetition";
  } else if (result === "stalemate") {
    return "stalemate";
  } else if (result === "insufficient" || result === "timevsinsufficient") {
    return "insufficient material";
  }
  return "unknown result";
}
function analyzeColor(result) {
  if (result === "win by checkmate")
    return { backgroundColor: "#a8e64c", hoverBackgroundColor: "#c2ee82" };
  else if (result === "win by timeout")
    return { backgroundColor: "#7ead39", hoverBackgroundColor: "#97cf44" };
  else if (result === "win by resignation/abandonment")
    return { backgroundColor: "#527125", hoverBackgroundColor: "#658a2e" };
  else if (result === "loss by checkmate")
    return { backgroundColor: "#b80f42", hoverBackgroundColor: "#cd577b" };
  else if (result === "loss by timeout")
    return { backgroundColor: "#8a0b32", hoverBackgroundColor: "#a60e3b" };
  else if (result === "loss by resignation/abandonment")
    return { backgroundColor: "#5a0720", hoverBackgroundColor: "#6e0928" };
  else if (result === "draw by agreement")
    return { backgroundColor: "#EAB308", hoverBackgroundColor: "#f0ca52" };
  else if (result === "draw by repetition")
    return { backgroundColor: "#b08606", hoverBackgroundColor: "#d3a107" };
  else if (result === "stalemate")
    return { backgroundColor: "#0dc3e7", hoverBackgroundColor: "#56d5ee" };
  else if (result === "insufficient material")
    return { backgroundColor: "#0a92ad", hoverBackgroundColor: "#0cb0d0" };
}
function countPlayerResults(results) {
  const resultCounts = {};
  results.forEach((result) => {
    if (resultCounts[result]) {
      resultCounts[result]++;
    } else {
      resultCounts[result] = 1;
    }
  });
  const resultArray = Object.keys(resultCounts).map((result) => ({
    type: result,
    count: resultCounts[result],
    color: analyzeColor(result)
  }));
  const priority = {
    "win by checkmate": 1,
    "win by timeout": 2,
    "win by resignation/abandonment": 3,
    "draw by agreement": 4,
    "draw by repetition": 5,
    stalemate: 6,
    "insufficient material": 7,
    "loss by checkmate": 8,
    "loss by timeout": 9,
    "loss by resignation/abandonment": 10
  };
  resultArray.sort((a, b) => {
    const priorityA = priority[a.type] || 99;
    const priorityB = priority[b.type] || 99;
    return priorityA - priorityB;
  });
  return resultArray;
}
async function processResults(username, dataToProcess, time_class) {
  const results = [];
  if (dataToProcess != null) {
    if (dataToProcess.length > 0) {
      dataToProcess.forEach((game) => {
        if (game.time_class == time_class) {
          const result = game.white.username.toLowerCase() === username.toLowerCase() ? game.white.result : game.black.result;
          const other = game.white.username.toLowerCase() === username.toLowerCase() ? game.black.result : game.white.result;
          results.push(analyzeResult(result, other));
        }
      });
      return countPlayerResults(results);
    } else {
      console.log("data not longer than 1");
      return null;
    }
  } else {
    console.log("data is null");
    return null;
  }
}
const parseECOUrl = (data) => {
  const ecoUrlMatch = data.match(/\[ECOUrl "(.*?)"\]/);
  if (ecoUrlMatch && ecoUrlMatch[1]) {
    const urlParts = ecoUrlMatch[1].split("/");
    return urlParts[urlParts.length - 1].replace(/-/g, " ");
  }
  return null;
};
async function processOpenings(username, dataToProcess, time_class) {
  console.log("processing openings");
  let openingStats = {};
  if (dataToProcess != null) {
    if (dataToProcess.length > 0) {
      dataToProcess.forEach((game) => {
        if (game.time_class == time_class) {
          const openingName = parseECOUrl(game.pgn);
          const win = game.white.username.toLowerCase() === username.toLowerCase() ? game.white.result : game.black.result;
          if (!openingStats[openingName]) {
            openingStats[openingName] = { games: 0, wins: 0 };
          }
          openingStats[openingName].games++;
          if (win === "win") {
            openingStats[openingName].wins++;
          }
        }
      });
      const results = Object.keys(openingStats).map((opening) => {
        const stats = openingStats[opening];
        const winRate = stats.wins / stats.games * 100;
        return {
          opening,
          winRate,
          //winRate.toFixed(2) + '%',
          gamesPlayed: stats.games,
          wins: stats.wins
        };
      });
      return results.sort((a, b) => {
        if (b.gamesPlayed === a.gamesPlayed) {
          return b.winRate - a.winRate;
        }
        return b.gamesPlayed - a.gamesPlayed;
      });
    } else {
      console.log("data not longer than 1");
      return null;
    }
  } else {
    console.log("data is null");
    return null;
  }
}
async function processRatingData(username, dataToProcess, time_class) {
  const ratings = [];
  const ratingsMap = /* @__PURE__ */ new Map();
  if (dataToProcess != null) {
    if (dataToProcess.length > 0) {
      dataToProcess.forEach((game) => {
        if (game.time_class == time_class) {
          const endTime = new Date(game.end_time * 1e3);
          const rating = game.white.username.toLowerCase() === username.toLowerCase() ? game.white.rating : game.black.rating;
          const result = game.white.username.toLowerCase() === username.toLowerCase() ? game.white.result : game.black.result;
          ratings.push({
            date: endTime.toISOString().slice(0, 10),
            rating,
            result
          });
          const date = endTime.toISOString().slice(0, 10);
          if (!ratingsMap.has(date)) {
            ratingsMap.set(date, []);
          }
          ratingsMap.get(date).push({ rating, result });
        }
      });
      console.log("ratings: ", ratings, "\nratingsMap: ", ratingsMap);
      const aggregatedRatings = Array.from(ratingsMap.entries()).map(([date, games]) => {
        const totalGames = games.length;
        const totalRating = games.reduce((total, game) => total + game.rating, 0);
        const winCount = games.filter((game) => game.result === "win").length;
        const drawCount = games.filter(
          (game) => ["agreed", "repetition", "stalemate", "insufficient", "timevsinsufficient"].includes(
            game.result
          )
        ).length;
        return {
          date,
          rating: Math.round(totalRating / totalGames),
          activity: totalGames,
          winRate: winCount / totalGames * 100,
          // Win rate as a percentage
          drawRate: drawCount / totalGames * 100,
          // Draw rate as a percentage
          lossRate: (totalGames - winCount - drawCount) / totalGames * 100
          //Loss rate as a percentage
        };
      });
      aggregatedRatings.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log("aggregated ratings: ", aggregatedRatings);
      return aggregatedRatings;
    } else {
      console.log("data not longer than 1");
      return null;
    }
  } else {
    console.log("data is null");
    return null;
  }
}
async function processRecentGames(username, dataToProcessTotal, time_class) {
  const recent = [];
  const dataToProcess = dataToProcessTotal?.slice(0, 10) ?? [];
  if (dataToProcess != null) {
    if (dataToProcess.length > 0) {
      dataToProcess.forEach((game) => {
        if (game.time_class == time_class) {
          const date = new Date(game.end_time * 1e3).toLocaleDateString("en-GB");
          const rating = game.white.username.toLowerCase() === username.toLowerCase() ? game.white.rating : game.black.rating;
          const ratingOpponent = game.white.username.toLowerCase() === username.toLowerCase() ? game.black.rating : game.white.rating;
          const result = game.white.username.toLowerCase() === username.toLowerCase() ? game.white.result : game.black.result;
          const color = game.white.username.toLowerCase() === username.toLowerCase() ? "white" : "black";
          const opening = parseECOUrl(game.pgn);
          recent.push({
            date,
            rating,
            ratingOpponent,
            result,
            time_class,
            color,
            opening
          });
        }
      });
      console.log("recent games: ", recent);
      recent.sort((a, b) => new Date(a.date) - new Date(b.date));
      return recent;
    } else {
      console.log("data not longer than 1");
      return null;
    }
  } else {
    console.log("data is null");
    return null;
  }
}
const userStats = writable([]);
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $userStats, $$unsubscribe_userStats;
  $$unsubscribe_userStats = subscribe(userStats, (value) => $userStats = value);
  let username = "";
  let time_class = "bullet";
  let gameData = {};
  let currentData = [];
  let stats = [];
  let openingData = [];
  let recentGames = [];
  async function updateData() {
    let activityData = await processRatingData(username, gameData.currentMonth ?? null, time_class);
    if (activityData) {
      activityData.map((data) => {
        const day = new Date(data.date).getDate();
        const activity = data.activity;
        const winRate = data.winRate;
        const drawRate = data.drawRate;
        const lossRate = data.lossRate;
        return {
          day,
          activity,
          winRate,
          drawRate,
          lossRate
        };
      });
    }
    recentGames = await processRecentGames(username, currentData ?? null, time_class);
    console.log("recent games2:", recentGames);
    await processResults(username, currentData ?? null, time_class);
    openingData = await processOpenings(username, currentData ?? null, time_class);
    console.log("opening data, ", openingData);
    stats = await processRatingData(username, currentData ?? null, time_class);
    if (stats?.length == 0) {
      let tempData = [];
      tempData = $userStats.chess_bullet;
      let tempStats = [
        {
          date: tempData.last.date,
          rating: tempData.last.rating
        },
        {
          date: tempData.last.date,
          rating: tempData.last.rating
        }
      ];
      stats = tempStats;
    }
    console.log("stats: ", stats);
  }
  {
    currentData = gameData?.currentMonth;
  }
  {
    {
      console.log("game data updated: ", gameData);
      updateData();
    }
  }
  $$unsubscribe_userStats();
  return `<div class="h-full w-full flex justify-center items-center"><div class="flex flex-col items-center w-full"><h1 class="h3 pt-10 mb-5" data-svelte-h="svelte-5qvxbn">Enter your Chess.com Username</h1> <div class="flex flex-row"><label class="label"><input class="input" type="text" placeholder="username"${add_attribute("value", username, 0)}></label> <button type="button" class="btn-icon variant-filled-primary mx-2" data-svelte-h="svelte-1vsgs5i"><img${add_attribute("src", logo, 0)} alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" class="p-2"></button></div> ${``} ${`${``}`}</div></div>`;
});
export {
  Page as default
};
