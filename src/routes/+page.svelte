<script>
    import { signInWithGoogle, signInWithGithub, signInAnon, user } from "../utils/firebase/auth";
    import { onMount } from "svelte";
    export const ssr = false;

    const title = "code-runner;";
    let word = $state("code-runner;");
    let curIdx = title.length - 1;
    let blinker;

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Make direction a function that increments or decrements
     * @param direction
     */
    function animateTitle(direction) {
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                curIdx = direction(curIdx);
                word = title.slice(0, curIdx);

                if (curIdx === title.length || curIdx === 0) {
                    clearInterval(interval);
                    return resolve();
                }
            }, 100);
        })
    }
    
    /**
     * Start animation effect on load
    */
    onMount(async () => {
        setInterval(() => {
            blinker.style.opacity = blinker.style.opacity === "1" ? "0" : "1";
        }, 500);

        let increment = (val) => val + 1;
        let decrement = (val) => val - 1;

        async function firstAnimation() {
            await animateTitle(decrement);
            await sleep(500);
            await animateTitle(increment);
            await sleep(2000);
        }

        await sleep(1000);
        firstAnimation();


        setInterval(async () => {
            await animateTitle(decrement);
            await sleep(500);
            await animateTitle(increment);
            await sleep(2000);
        }, 4500);
    });
</script>

<div class="grid h-screen place-items-center text-white text-4xl">
    <div class="flex flex-col items-center gap-3">
        <div class="text-left">
            {word}<span bind:this={blinker} style="width: 0">_</span>
        </div>
        <br>

        {#if !user}
            <!-- <span class="text-base">sign in with</span> -->

            <!-- https://developers.google.com/identity/branding-guidelines -->
             <div class="flex flex-row align-center gap-2">
                <button class="gsi-material-button mb-5" onclick={signInWithGoogle}>
                    <div class="gsi-material-button-state"></div>
                    <div class="gsi-material-button-content-wrapper">
                    <div class="gsi-material-button-icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                    </div>
                    <span class="gsi-material-button-contents">Sign in with Google</span>
                    <span style="display: none;">Sign in with Google</span>
                    </div>
                </button>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- <div class="w-8 relative top-2 cursor-pointer" onclick={signInWithGoogle}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                </div> -->
                <!-- <div>|</div>
                <div class="w-8 relative top-1 cursor-pointer" onclick={signInWithGithub}>
                    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
                    </svg>
                </div> -->
            </div>
            
            <!-- <span class="text-base">or</span> -->

            <button class="gsi-material-button" onclick={signInAnon}>
                <div class="gsi-material-button-state"></div>
                <div class="gsi-material-button-content-wrapper">
                <span class="gsi-material-button-contents">Continue as Guest</span>
                <span style="display: none;">Continue as Guest</span>
                </div>
            </button>
        {:else}
            <a href="/home">
                <button class="gsi-material-button">
                    <div class="gsi-material-button-state"></div>
                    <div class="gsi-material-button-content-wrapper">
                    <span class="gsi-material-button-contents">Home</span>
                    <span style="display: none;">Home</span>
                    </div>
                </button>
            </a>
        {/if}
    </div>
</div>
