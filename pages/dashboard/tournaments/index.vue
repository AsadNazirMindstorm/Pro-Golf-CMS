<template>
    <div class="flex justify-between mb-8 mt-4">
        <h1 class="lg:text-3xl font-semibold">Tournaments</h1>
        <NuxtLink to="/dashboard/tournaments/create">
            <v-btn color="blue" prepend-icon="mdi-plus">Create Tournament</v-btn>
        </NuxtLink>
    </div>
    <div class="tournamentsTables">
        <div class="searchBar w-[70%] my-8 flex items-center">
            <v-text-field :loading="loading" v-model="tournaments" append-inner-icon="mdi-magnify" density="compact"
                label="Search templates" variant="solo" hide-details single-line></v-text-field>
            <div class="mx-6"> <v-btn color="success" variant="elevated">Search</v-btn></div>
        </div>

        <v-data-table-server style="box-shadow: grey 0px 0px 18px -8px; border-radius: 5px;"
            v-model:items-per-page="itemsPerPage" :headers="headers" :items="itemsForDisplay" :items-length="totalItems"
            :loading="loading" item-value="id" v-model="selected" :search="search" return-object
            @update:options="loadItems" show-select>

            <!-- Custom Tournaments Header -->
            <template v-slot:header.tournaments="{ column }">
                <span class="font-bold">
                    {{ column.title.toUpperCase() }}
                </span>
            </template>

            <!-- Loading Icon -->
            <template v-slot:item.icon="{ item }">
                <v-img :src="item.icon" :alt="item.name" style="width: 10vw; max-width: 6rem; padding: 0.5rem 0;"
                    contain></v-img>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon class="me-2" size="large" @click="">
                    mdi-pencil
                </v-icon>
                <v-icon size="large" @click="">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table-server>
        <div>
            {{ selected }}
        </div>
    </div>
    <NuxtPage />
</template>

<script setup lang="ts">
import { tournamentIconsArrays } from '~/constants/FormConstants';
import type { ServerResponse } from '~/schemas/responseSchema';
import { type Tournament } from '~/schemas/tournamentSchema';


// Reactive state
const itemsPerPage = ref(5);
const headers = ref([
    {
        title: '',
        key: 'select',
        align: 'center',
        sortable: false,
    },
    {

        title: 'Id',
        align: 'center',
        sortable: false,
        key: 'id',
    },

    {
        title: 'Tournaments',
        align: 'start',
        sortable: false,
        key: 'tournaments',
    },
    {
        title: 'League',
        key: 'league',
        sortable: false,
        align: 'center'
    },

    {
        title: 'Icon',
        key: 'icon',
        align: 'center',
        sortable: false,
    },
    {
        title: 'Created At',
        key: 'createdAt',
        align: 'center',
        sortable: false,
    },
    {
        title: 'Updated At',
        key: 'updatedAt',
        align: 'center',
        sortable: false,
    },
    {
        title: 'Actions',
        key: 'actions',
        sortable: false
    },
]);
const tournaments = ref<string>('');
const search = ref<string>('');
const serverItems = ref<Tournament[]>([]);
const loading = ref<boolean>(true);
const totalItems = ref<number>(0);
const selectAll = ref<boolean>(false);
const selected = ref<number[]>([]);
const itemsForDisplay = ref<Object[]>([]);

// Method to load items from the server
const loadItems = async ({ page, itemsPerPage, sortBy }: { page: number, itemsPerPage: number, sortBy: string[] }) => {
    loading.value = true;
    try {
        const response: ServerResponse = await $fetch('/api/getAllTournaments', {
            query: {
                "page": page,
                "itemsPerPage": itemsPerPage,
            }
        });
        serverItems.value = response.data;

        //loop through it
        itemsForDisplay.value = [];
        let index: number = 1;
        serverItems.value.forEach(element => {
            let tempObj = {
                tournamentId: element.metaData.category,
                id: index++,
                tournaments: element.metaData.title, //title of tournament
                icon: tournamentIconsArrays[Number(element.metaData.icon) - 1].img, //using images locally
                league: element.metaData.league,
                createdAt: element.createdAt ? element.createdAt : " ",
                updatedAt: element.updatedAt ? element.updatedAt : " ",
                name: tournamentIconsArrays[Number(element.metaData.icon) - 1].name
            }
            itemsForDisplay.value.push(tempObj);
        });

    } catch (error) {
        console.error('Failed to load items', error);
    } finally {
        loading.value = false;
    }
};


//Delete and edit handler
const handleDelete = (item:any) =>
{
    alert("Delete is pressed");
}

// Watcher for tournaments changes
watch(tournaments, () => {
    search.value = String(Date.now());
});
</script>
