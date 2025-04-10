<!-- Component for displaying player rivals -->
<script>
	import { Skull, Sword } from "lucide-svelte";

    export let data = [];
    
    // Initialize nemesis and victim
    let nemesis = { username: "No data", losses: 0, total: 0 };
    let victim = { username: "No data", wins: 0, total: 0 };

    // Process data to find rivals
    $: if (data?.length > 0) {
        // Reset to default values
        nemesis = { username: "No data", losses: 0, total: 0 };
        victim = { username: "No data", wins: 0, total: 0 };
        
        // Find nemesis and most defeated opponent
        data.forEach(({ opponent, stats }) => {
            if (stats.total >= 3) {  // Only consider opponents with 3+ games
                if (stats.losses > nemesis.losses) {
                    nemesis = { 
                        username: opponent, 
                        losses: stats.losses, 
                        total: stats.total 
                    };
                }
                if (stats.wins > victim.wins) {
                    victim = { 
                        username: opponent, 
                        wins: stats.wins, 
                        total: stats.total 
                    };
                }
            }
        });
    }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
    <!-- Nemesis -->
    <div class="flex flex-col items-center justify-center p-4 rounded-lg bg-surface-100-800-token/30 backdrop-blur-sm">
        <div class="flex flex-col items-center space-y-2 w-full">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-2">
                <Skull class="w-6 h-6 text-red-500" />
            </div>
            <h3 class="text-lg font-semibold">Nemesis</h3>
            <div class="text-center w-full p-3 rounded-lg bg-red-500/5">
                <p class="text-xl font-bold truncate max-w-full" title={nemesis.username}>
                    {nemesis.username}
                </p>
                <div class="flex justify-between items-center mt-2 text-sm">
                    <span class="opacity-80">Losses</span>
                    <span class="font-semibold text-red-500">{nemesis.losses}</span>
                </div>
                <div class="flex justify-between items-center mt-1 text-xs">
                    <span class="opacity-60">Total Games</span>
                    <span>{nemesis.total}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Most Defeated -->
    <div class="flex flex-col items-center justify-center p-4 rounded-lg bg-surface-900-50-token/30 backdrop-blur-sm">
        <div class="flex flex-col items-center space-y-2 w-full">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-2">
                <Sword class="w-6 h-6 text-green-500" />
            </div>
            <h3 class="text-lg font-semibold">Most Defeated</h3>
            <div class="text-center w-full p-3 rounded-lg bg-green-500/5">
                <p class="text-xl font-bold truncate max-w-full" title={victim.username}>
                    {victim.username}
                </p>
                <div class="flex justify-between items-center mt-2 text-sm">
                    <span class="opacity-80">Wins</span>
                    <span class="font-semibold text-green-500">{victim.wins}</span>
                </div>
                <div class="flex justify-between items-center mt-1 text-xs">
                    <span class="opacity-60">Total Games</span>
                    <span>{victim.total}</span>
                </div>
            </div>
        </div>
    </div>
</div> 