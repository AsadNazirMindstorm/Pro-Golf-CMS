<template>
    <div class="flex justify-between mb-8 mt-4">
        <h1 class="lg:text-3xl font-semibold">Tournaments</h1>
        <div>
            <NuxtLink to="/dashboard/tournaments/create">
                <v-btn class="me-4" color="blue" prepend-icon="mdi-plus">Create Tournament</v-btn>
            </NuxtLink>

            <v-btn class="" @click="handlePushToNakama" :disabled="selected.length === 0" prepend-icon="mdi-upload-box"
                color="purple">Push to Nakama</v-btn>
        </div>
    </div>
    <div class="tournamentsTables">
        <div class="searchBar w-[70%] my-8 flex item-center justify-between">
            <v-text-field :loading="loading" v-model="tournaments" append-inner-icon="mdi-magnify" density="compact"
                label="Search templates" variant="solo" hide-details single-line></v-text-field>

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

            <!-- Custom Tournaments Header -->
            <template v-slot:header.pushedToNakama="{ column }">
                <span class="font-bold">
                    {{ column.title.toUpperCase() }}
                </span>
            </template>
            <!-- Loading Icon -->
            <template v-slot:item.icon="{ item }">
                <v-img :src="item.icon" :alt="item.name" style="width: 10vw; max-width: 6rem; padding: 0.5rem 0;"
                    contain></v-img>
            </template>


            <template v-slot:item.pushedToNakama="{ item }">
                <span v-if="item.pushedToNakama" class="bg-green-300 text-green-900 rounded-xl px-4 py-2">Yes</span>
                <span v-else class="bg-red-300 text-red-900 rounded-xl px-4 py-2">No</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon class="me-2" size="small" @click="handleEdit(item)">
                    mdi-pencil
                </v-icon>
                <v-icon class="me-2" size="small" @click="handleDelete(item)">
                    mdi-delete
                </v-icon>
                <v-icon class="me-2" size="small" @click="handleCopy(item)">
                    mdi-content-copy
                </v-icon>
                <v-icon size="small" @click="handleDuplicate(item)">
                    mdi-content-duplicate
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
import { JsonForms } from '@jsonforms/vue';
import { useDebounceFn } from '@vueuse/core';
import { tournamentIconsArrays } from '~/constants/FormConstants';
import type { ServerResponse } from '~/schemas/responseSchema';
import { type Tournament } from '~/schemas/tournamentSchema';
import { debounce } from '~/Utility/debounce';


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
        title: 'Pushed',
        key: 'pushedToNakama',
        align: 'center',
        sortable: false
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
const selected = ref<Object[]>([]);
const itemsForDisplay = ref<Object[]>([]);

// Method to load items from the server
const loadItems = async ({ page, itemsPerPage, sortBy, search }: { page: number, itemsPerPage: number, sortBy: string[], search: string }) => {
    loading.value = true;
    console.log(tournaments);
    try {
        const response: ServerResponse = await $fetch('/api/getAllTournaments', {
            query: {
                "page": page,
                "itemsPerPage": itemsPerPage,
                'search': tournaments.value
            }
        });
        serverItems.value = response.data.items;
        totalItems.value = response.data.totalCount;

        //loop through it
        itemsForDisplay.value = [];
        let index: number = 1;
        serverItems.value.forEach(element => {
            let tempObj = {
                tournamentId: element.metaData.category,
                id: index++,
                tournaments: element.metaData.title, //title of tournament
                pushedToNakama: element.pushedToNakama,
                icon: tournamentIconsArrays[Number(element.metaData.icon) - 1].img, //using images locally
                league: element.metaData.league,
                createdAt: element.createdAt ? element.createdAt : " ",
                updatedAt: element.updatedAt ? element.updatedAt : " ",
                name: tournamentIconsArrays[Number(element.metaData.icon) - 1].name,
                completeObject: element
            }
            itemsForDisplay.value.push(tempObj);
        });

    } catch (error) {
        console.error('Failed to load items', error);
    } finally {
        loading.value = false;
    }
};

const handleDuplicate = async (item: any) => {
    try {
        const serverResponse: ServerResponse = await $fetch('/api/copyTournament', {
            method: 'POST',
            body: JSON.stringify(item.completeObject)
        })

        if (serverResponse.success) {
            alert("Created a copy succesfully");
            await loadItems({
                page: 1, // Assuming you want to start from the first page
                itemsPerPage: itemsPerPage.value,
                sortBy: [], // Adjust sorting if needed,
                search: ''
            });
        }
        else {
            alert("Error Occurred");
        }
    }
    catch (error: any) {
        alert("Error Occurred")
    }
}

//Delete and edit handler
const handleDelete = async (item: any) => {
    try {
        console.log(item);
        const serverResponse: ServerResponse = await $fetch('/api/deleteTournament', {
            method: 'DELETE',
            body: JSON.stringify({
                id: item.tournamentId
            })
        })

        if (serverResponse.success) {
            alert('deleted successfully');
            await loadItems({
                page: 1, // Assuming you want to start from the first page
                itemsPerPage: itemsPerPage.value,
                sortBy: [], // Adjust sorting if needed,
                search: ''
            });


        }
        else {
            alert("error occurred");
        }

    }
    catch (error: any) {

    }
}


const handleEdit = (item: any) => {
    const router = useRouter();
    // Navigate to /dashboard/edit/:id with item.uuid
    router.push('/dashboard/tournaments/edit/' + item.tournamentId);
};

const handleCopy = async (item: any) => {
    try {
        await navigator.clipboard.writeText(JSON.stringify(item.completeObject));
        alert('copied successfully');
    }
    catch (error: any) {
        alert("Error occured");
    }
}

const handlePushToNakama = async () => {
    try {


        let dataToBePushed: Tournament[] = [];

        selected.value.forEach(ele => {
            dataToBePushed.push(ele.completeObject);
        })

        const res: ServerResponse = await $fetch('/api/pushToNakama', {
            method: 'POST',
            body: JSON.stringify(dataToBePushed)
        })

        if (res.success) {
            alert("Pushed To Nakama");
        }
        await loadItems({
            page: 1, // Assuming you want to start from the first page
            itemsPerPage: itemsPerPage.value,
            sortBy: [], // Adjust sorting if needed,
            search: ''
        });

        selected.value = [];
    }
    catch (err: any) {
        alert("Error Occurred")
    }


}

const debounce = useDebounceFn(() => {
    // debounce(() => { search.value = String(Date.now()); }, 500);
    search.value = String(Date.now());
}, 500)

// Watcher for tournaments changes
watch(tournaments, () => {
    debounce();
});
</script>
