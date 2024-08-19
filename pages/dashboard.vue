<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer style="box-shadow: 1px 1px 10px -2px grey;" expand-on-hover >

                <div class="imageFooterNav w-full flex px-3 mb-3 justify-between py-12">
                    <img src="../assets/logo.webp" class="w-[25%]" srcset="">
                    <img src="../assets/progolf-text.webp" class="w-[70%] object-contain">
                   
                </div>

                <v-list>
                    <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
                        subtitle="asadnazir1712@gmail.com" title="Asad Nazir" class=""></v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list density="compact" nav>
                    <NuxtLink to="/dashboard/tournaments">
                        <v-list-item prepend-icon="mdi-tournament" title="Tournaments" value="tournaments"></v-list-item>
                    </NuxtLink>
                    <NuxtLink to="/dashboard/changelogs">
                        <v-list-item prepend-icon="mdi-clipboard-text-clock-outline" title="Change Logs"
                            value="changelogs"></v-list-item>
                    </NuxtLink>
                    <NuxtLink to="/">
                        <v-list-item prepend-icon="mdi-logout" title="Logout"
                            value="shared"></v-list-item>
                    </NuxtLink>
                </v-list>

            </v-navigation-drawer>
            <v-main style="min-height: 100vh;">
                <NuxtPage />
            </v-main>
        </v-layout>

    </v-card>
</template>

<style>
.imageFooterNav {
    background-image: linear-gradient(#00000063, #0000008f), url('../assets/banner-bg.webp');
    background-size: cover;

}
</style>