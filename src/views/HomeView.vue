<script setup lang="ts">
    const isDev = import.meta.env.DEV;
</script>

<template>
    <p class="h4 m-4">AVIANART is the brainchild of StructuralMike and homemadebeer<br><br></p>
    <p class="lead m-4">We want to build a community that enjoys playing rando in a semi-competitive environment where the goal is to enjoy all the fun options this game has to offer.</p>
    <p class="h6 m-4">
        The 2022 tournament featured five modes:
        <br>True Pot Hunt
        <br>Invertacrismizer
        <br>Anti-Vrosia
        <br>Why is THAT there!?
        <br>iS tHiS eVeN rAnDoMiZeD?
        <br><br>
        In addition to these initial modes, we have become a host for other creative or off-beat modes.

        <br>We encourage you to check out the modes we offer at the link below!
    </p>
    <hr>

    <router-link to="/generate" class="av_link"><button class="av_btn">Generate a Preset</button></router-link>&nbsp;
    <router-link to="/mmmm" class="av_link"><button class="av_btn">MMMM</button></router-link>&nbsp;
    <router-link to="/customize" class="av_link"><button class="av_btn">Use the Customizer <small>[beta]</small></button></router-link>&nbsp;

    <template v-if="isDev">
        <br><br>
        <p class="h4 m-4">Development Links</p>
        <router-link to="/perm/Cfu6NPAt0" class="av_link"><button class="av_btn">Test TPH</button></router-link>&nbsp;
        <router-link to="/perm/yZkTNYg2A" class="av_link"><button class="av_btn">Test Permlink</button></router-link>&nbsp;
        <router-link to="/perm/DlzjxA6tM" class="av_link"><button class="av_btn">Test Permlink (race seed)</button></router-link>&nbsp;
        <router-link to="/perm/yMolyP7fC" class="av_link"><button class="av_btn">Test Permlink (enemized)</button></router-link>
        <br><br>
        <router-link to="/perm/CL8PNCpPW" class="av_link"><button class="av_btn">Test Permlink (legacy tph)</button></router-link>&nbsp;
        <router-link to="/perm/mtrcJF95i" class="av_link"><button class="av_btn">Test Permlink (legacy kpd)</button></router-link>&nbsp;
        <router-link to="/perm/2aKtU4sRb" class="av_link"><button class="av_btn">Test Permlink (legacy kpd [race])</button></router-link>&nbsp;
        <router-link to="/perm/KJG39oxzv3" class="av_link"><button class="av_btn">Test Permlink (VT Seed)</button></router-link>&nbsp;
        <router-link to="/perm/v1FiZ72J0vH" class="av_link"><button class="av_btn">Test Permlink (v1 Seed)</button></router-link>&nbsp;
    </template>

    <p class="h1 mb-2"><a href="https://discord.gg/eSpTVfyAcK"><i-jam-discord /></a></p>
</template>