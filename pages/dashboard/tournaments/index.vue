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
                label="Search templates" variant="solo" hide-details single-line
                @click:append-inner="onClick"></v-text-field>
            <div class="mx-6"> <v-btn color="success" variant="elevated">Search</v-btn></div>
        </div>

        <v-data-table-server style="box-shadow: grey 0px 0px 18px -8px; border-radius: 5px;"
            v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems" :items-length="totalItems"
            :loading="loading" item-value="id" v-model="selected" :search="search" return-object
            @update:options="loadItems" show-select>

            <template v-slot:header.tournaments="{ column }">
                <span class="font-bold">
                    {{ column.title.toUpperCase() }}
                </span>
            </template>

            <template v-slot:item.image="{ item }">
                <v-img :src="item.image" :alt="item.name" style="width: 10vw; max-width: 8rem; padding: 1rem 0;"
                    contain></v-img>
            </template>
        </v-data-table-server>
        <div>
            {{ selected }}
        </div>
    </div>
    <NuxtPage />
</template>

<script>
const desserts = [
    // Updated with image URLs
    {
        id: "1",
        tournaments: 'Hawk Eye Tournament',
        allowedPlayers: 159,
        entryType: 6.0,
        amount: 24,
        type: "CAREER",
        tickets: '1',
        prizePool: 900,
        image: "https://i.postimg.cc/qvHfDnbQ/pngwing-com.png"
    },
    // Updated with image URLs
    {
        id: "2",
        tournaments: 'Hawk Eye Tournament',
        allowedPlayers: 159,
        entryType: 6.0,
        amount: 24,
        type: "CAREER",
        tickets: '1',
        prizePool: 900,
        image: "https://i.postimg.cc/qvHfDnbQ/pngwing-com.png"
    },
    // Updated with image URLs
    {
        id: "3",
        tournaments: 'Hawk Eye Tournament',
        allowedPlayers: 159,
        entryType: 6.0,
        amount: 24,
        type: "CAREER",
        tickets: '1',
        prizePool: 900,
        image: "https://i.postimg.cc/qvHfDnbQ/pngwing-com.png"
    },
    // Updated with image URLs
    {
        id: "4",
        tournaments: 'Hawk Eye Tournament',
        allowedPlayers: 159,
        entryType: 6.0,
        amount: 24,
        type: "CAREER",
        tickets: '1',
        prizePool: 900,
        image: "https://i.postimg.cc/qvHfDnbQ/pngwing-com.png"
    },
    // Updated with image URLs
    {
        id: "5",
        tournaments: 'Hawk Eye Tournament',
        allowedPlayers: 159,
        entryType: 6.0,
        amount: 24,
        type: "CAREER",
        tickets: '1',
        prizePool: 900,
        image: "https://i.postimg.cc/qvHfDnbQ/pngwing-com.png"
    },
    // Updated with image URLs
    {
        id: "6",
        tournaments: 'Hawk Eye Tournament',
        allowedPlayers: 159,
        entryType: 6.0,
        amount: 24,
        type: "CAREER",
        tickets: '1',
        prizePool: 900,
        image: "https://i.postimg.cc/qvHfDnbQ/pngwing-com.png"
    },
    // Updated with image URLs
    {
        id: "7",
        tournaments: 'xyz Eye Tournament',
        allowedPlayers: 159,
        entryType: 6.0,
        amount: 24,
        type: "CAREER",
        tickets: '1',
        prizePool: 900,
        image: "https://i.postimg.cc/qvHfDnbQ/pngwing-com.png"
    },


]

const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy, search }) {
        console.log("This is Search" + search)
        return new Promise(resolve => {
            setTimeout(() => {
                const start = (page - 1) * itemsPerPage
                const end = start + itemsPerPage
                const items = desserts.slice().filter(item => {
                    if (search.tournaments && !item.tournaments.toLowerCase().includes(search.tournaments.toLowerCase())) {
                        return false
                    }

                    return true
                })

                const paginated = items.slice(start, end)

                resolve({ items: paginated, total: items.length })
            }, 500)
        })
    },
}

export default {
    data: () => ({
        itemsPerPage: 5,
        headers: [
            {
                title: '',
                key: 'select',
                align: 'center',
                sortable: false,
            },
            {
                title: "ID",
                key: 'id',
                align: 'left',
                sortable: false
            },
            {
                title: 'Tournaments',
                align: 'start',
                sortable: false,
                key: 'tournaments',
            },
            {
                title: 'Image',
                key: 'image',
                align: 'center',
                sortable: false
            },
            { title: 'Allowed Players', key: 'allowedPlayers', align: 'end' },
            { title: 'Entry Type', key: 'entryType', align: 'end' },
            { title: 'Amount', key: 'amount', align: 'end' },
            { title: 'Type', key: 'type', align: 'end' },
            { title: 'Tickets', key: 'tickets', align: 'end' },
            { title: 'Prize Pool', key: 'prizePool', align: 'end' },
        ],
        tournaments: '',
        search: '',
        serverItems: [],
        loading: true,
        totalItems: 0,
        selectAll: false,
        selected: [],

    }),
    methods: {
        loadItems({ page, itemsPerPage, sortBy }) {
            this.loading = true
            FakeAPI.fetch({
                page,
                itemsPerPage,
                sortBy,
                search: { tournaments: this.tournaments },
            }).then(({ items, total }) => {
                this.serverItems = items
                this.totalItems = total
                this.loading = false
            })
        },

        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedItems = [...this.serverItems]
            } else {
                this.selectedItems = []
            }
        },

    },
    watch: {
        tournaments() {
            this.search = String(Date.now())
        },
    },
}
</script>
