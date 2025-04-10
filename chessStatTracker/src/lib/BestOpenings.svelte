<!-- Component for displaying best openings by color -->
<script>
    export let data = [];
    
    // Process data to find best openings by color
    $: bestOpenings = {
        white: data?.filter(opening => opening.gamesPlayed >= 3)
            .reduce((best, current) => {
                if (!best.white || current.whiteWinRate > best.white.winRate) {
                    return { ...best, white: { opening: current.opening, winRate: current.whiteWinRate, games: current.whiteGames } };
                }
                return best;
            }, { white: null })?.white || { opening: "No data", winRate: 0, games: 0 },
        black: data?.filter(opening => opening.gamesPlayed >= 3)
            .reduce((best, current) => {
                if (!best.black || current.blackWinRate > best.black.winRate) {
                    return { ...best, black: { opening: current.opening, winRate: current.blackWinRate, games: current.blackGames } };
                }
                return best;
            }, { black: null })?.black || { opening: "No data", winRate: 0, games: 0 }
    };
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full ">
    <!-- Best White Opening -->
    <div class="flex flex-col items-center justify-center p-4 rounded-lg bg-surface-100-800-token/30 backdrop-blur-sm">
        <div class="flex flex-col items-center space-y-2 w-full">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-2">
                <svg fill="#FFFFFF" height="100px" width="100px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 297 297" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M223.333,247h-5.926c2.607-3.811,10.798-18.024-0.727-32.248c-13.334-16.46-39.863-65.748-27.324-98.752h0.977 c4.418,0,7.667-3.582,7.667-8v-1c0-4.418-3.249-8-7.667-8h-1.225c10.917-10.466,17.725-25.184,17.725-41.5 c0-31.756-25.744-57.5-57.5-57.5s-57.5,25.744-57.5,57.5c0,16.316,6.808,31.034,17.725,41.5h-2.225c-4.418,0-8.333,3.582-8.333,8v1 c0,4.418,3.915,8,8.333,8h1.979c12.539,33.004-13.99,82.292-27.324,98.752c-11.524,14.224-3.334,28.437-0.727,32.248h-6.928 c-4.418,0-8.333,3.582-8.333,8v18c0,4.418,3.915,8,8.333,8H75v16h148v-16c5,0,8-3.582,8-8v-18C231,250.582,227.751,247,223.333,247 z"></path> </g> </g></svg>
            </div>
            <h3 class="text-lg font-semibold">Best as White</h3>
            <div class="text-center w-full p-3 rounded-lg bg-white/5">
                <p class="text-xl font-bold truncate max-w-full" title={bestOpenings.white.opening}>
                    {bestOpenings.white.opening}
                </p>
                <div class="flex justify-between items-center mt-2 text-sm">
                    <span class="opacity-80">Win Rate</span>
                    <span class="font-semibold">{bestOpenings.white.winRate.toFixed(1)}%</span>
                </div>
                <div class="flex justify-between items-center mt-1 text-xs">
                    <span class="opacity-60">Games</span>
                    <span>{bestOpenings.white.games}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Best Black Opening -->
    <div class="flex flex-col items-center justify-center p-4 rounded-lg bg-surface-900-50-token/30 backdrop-blur-sm">
        <div class="flex flex-col items-center space-y-2 w-full">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-2">
                <svg fill="#00000a" height="100px" width="100px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 297 297" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M223.333,247h-5.926c2.607-3.811,10.798-18.024-0.727-32.248c-13.334-16.46-39.863-65.748-27.324-98.752h0.977 c4.418,0,7.667-3.582,7.667-8v-1c0-4.418-3.249-8-7.667-8h-1.225c10.917-10.466,17.725-25.184,17.725-41.5 c0-31.756-25.744-57.5-57.5-57.5s-57.5,25.744-57.5,57.5c0,16.316,6.808,31.034,17.725,41.5h-2.225c-4.418,0-8.333,3.582-8.333,8v1 c0,4.418,3.915,8,8.333,8h1.979c12.539,33.004-13.99,82.292-27.324,98.752c-11.524,14.224-3.334,28.437-0.727,32.248h-6.928 c-4.418,0-8.333,3.582-8.333,8v18c0,4.418,3.915,8,8.333,8H75v16h148v-16c5,0,8-3.582,8-8v-18C231,250.582,227.751,247,223.333,247 z"></path> </g> </g></svg>
            </div>
            <h3 class="text-lg font-semibold">Best as Black</h3>
            <div class="text-center w-full p-3 rounded-lg bg-black/5">
                <p class="text-xl font-bold truncate max-w-full" title={bestOpenings.black.opening}>
                    {bestOpenings.black.opening}
                </p>
                <div class="flex justify-between items-center mt-2 text-sm">
                    <span class="opacity-80">Win Rate</span>
                    <span class="font-semibold">{bestOpenings.black.winRate.toFixed(1)}%</span>
                </div>
                <div class="flex justify-between items-center mt-1 text-xs">
                    <span class="opacity-60">Games</span>
                    <span>{bestOpenings.black.games}</span>
                </div>
            </div>
        </div>
    </div>
</div> 