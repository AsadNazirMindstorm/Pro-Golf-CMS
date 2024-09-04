<template>
    <h1>Change Logs</h1>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
        :items-length="totalItems" :loading="loading" :search="search" item-value="name" @update:options="loadItems">

        <template v-slot:item.actions="{ item }">
            <Changlog :new-json="item.new_data" :old-json="item.old_data" />
        </template>
    </v-data-table-server>

</template>

<script setup lang="ts">
import type { Changelog } from '~/DAO/changlogDAO';
import type { ServerResponse } from '~/schemas/responseSchema';


interface ChanglogResults {
    itemCount: number,
    items: Changelog[]
}

const itemsPerPage = ref(5)
const headers = [
    { title: 'ID', align: 'start', sortable: false, key: 'id' },
    { title: 'Tournament ID', key: 'tournament_id', sortable: false, align: 'start' },
    { title: 'Action', key: 'action', align: 'start', sortable: false },
    { title: 'Actions', key: 'actions', align: 'center', sortable: false },

]

const serverItems = ref<Changelog[]>([])
const loading = ref(true)
const totalItems = ref(0)
const name = ref('')
const calories = ref('')
const search = ref('')

watch([name, calories], () => {
    search.value = String(Date.now())
})

const handleChangeLogView = () => {
    alert('clicked');
}

async function loadItems({ page, itemsPerPage }: { page: number; itemsPerPage: number }) {
    try {
        loading.value = true

        const res: ServerResponse = await $fetch('/api/getAllChangeLogs', {
            query: {
                page,
                itemsPerPage
            }
        })

        if (!res.success) {
            alert('Error fetching the records');
        }

        //interface of change log results
        const data: ChanglogResults = res.data as ChanglogResults;

        serverItems.value = data.items;
        totalItems.value = data.itemCount;

        loading.value = false;
    }
    catch (error: any) {
        alert("Error Occurred");
    }

}

</script>