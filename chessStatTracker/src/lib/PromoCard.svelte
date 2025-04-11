<!-- Promotional card component for showcasing other apps -->
<script>
    import prettyshot from '$lib/assets/prettyshot.jpg';
</script>

<div class="glass-card p-6">
    <h2 class="h4 text-center mb-4">Check Out Our Other Apps</h2>
    <a href="https://prettyscreenshot.com" target="_blank" rel="noopener noreferrer" class="no-underline hover:scale-105 transition-transform duration-200">
        <div class="card p-4 variant-filled-surface">
            <div class="flex flex-col md:flex-row items-center gap-6">
                <div class="w-full md:w-1/3">
                    <img src={prettyshot} alt="PrettyShot Screenshot Tool" class="rounded-lg w-full h-auto shadow-lg" />
                </div>
                <div class="w-full md:w-2/3 text-center md:text-left space-y-4">
                    <h3 class="h3">PrettyShot</h3>
                    <p class="text-lg opacity-90">Transform your screenshots into beautiful presentations with just a few clicks. Add backgrounds, shadows, and effects – all in your browser.</p>
                    <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                        <span class="chip variant-filled">Beautiful Backgrounds</span>
                        <span class="chip variant-filled">Professional Effects</span>
                        <span class="chip variant-filled">Device Mockups</span>
                    </div>
                </div>
            </div>
        </div>
    </a>
</div> 