<template>
    <div class="p-7">
        <h1 class="lg:text-3xl font-semibold">Tournaments</h1>

        <div class="flex flex-row-reverse mb-8 mt-4">
            <v-btn color="blue" prepend-icon="mdi-plus">Create</v-btn>
        </div>
        <div class="tournamentsTables">
            <div class="searchBar w-[70%] my-4 flex items-center">
                <v-text-field :loading="loading" append-inner-icon="mdi-magnify" density="compact"
                    label="Search templates" variant="solo" hide-details single-line
                    @click:append-inner="onClick"></v-text-field>
                <div class="mx-6"> <v-btn color="success" variant="elevated">Search</v-btn></div>
            </div>
            <v-data-table-server style="box-shadow: 1px 1px 1px 1px grey;" v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
                :items-length="totalItems" :loading="loading" :search="search" item-value="name"
                @update:options="loadItems">

                <!-- Header Scoped Slot with Select All Checkbox -->
                <template v-slot:column.select="{ column }">
                    <v-checkbox v-model="selectAll" @change="toggleSelectAll" class="select-all-checkbox"
                        :label="column.title">
                    </v-checkbox>
                </template>

                <!-- Row Scoped Slot with Individual Row Checkboxes -->
                <template v-slot:item.select="{ item }">
                    <v-checkbox v-model="selectedItems" :value="item" class="select-item-checkbox">
                    </v-checkbox>
                </template>

                <template v-slot:item.image="{ item }">
                    <v-img :src="item.image" :alt="item.name" max-width="100" max-height="100" contain></v-img>
                </template>
            </v-data-table-server>
        </div>
    </div>
</template>

<script>
const desserts = [
    // Updated with image URLs
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1',
        image: 'https://randomuser.me/api/portraits/men/78.jpg'
    },
    {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        iron: '0',
        image: 'https://example.com/images/jelly-bean.jpg'
    },
    // Add image URLs for other items similarly
]

const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy }) {
        return new Promise(resolve => {
            setTimeout(() => {
                const start = (page - 1) * itemsPerPage
                const end = start + itemsPerPage
                const items = desserts.slice()

                if (sortBy.length) {
                    const sortKey = sortBy[0].key
                    const sortOrder = sortBy[0].order
                    items.sort((a, b) => {
                        const aValue = a[sortKey]
                        const bValue = b[sortKey]
                        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
                    })
                }

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
                title: 'Dessert (100g serving)',
                align: 'start',
                sortable: false,
                key: 'name',
            },
            {
                title: 'Image',
                key: 'image',
                align: 'center',
                sortable: false
            },
            { title: 'Calories', key: 'calories', align: 'end' },
            { title: 'Fat (g)', key: 'fat', align: 'end' },
            { title: 'Carbs (g)', key: 'carbs', align: 'end' },
            { title: 'Protein (g)', key: 'protein', align: 'end' },
            { title: 'Iron (%)', key: 'iron', align: 'end' },
        ],
        search: '',
        serverItems: [],
        loading: true,
        totalItems: 0,
        selectAll: false,
        selectedItems: [],
    }),
    methods: {
        loadItems({ page, itemsPerPage, sortBy }) {
            this.loading = true
            FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
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
        }
    },
}
</script>

<style scoped>
/* Custom styles for header text and checkboxes */
.select-all-checkbox {}

.select-item-checkbox {
    /* border: 2px solid red; */
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
