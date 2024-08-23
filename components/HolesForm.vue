<template>
    <div class="lg:w-[50%]">
        <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />
    </div>
    <div class="flex justify-between mb-8 mt-4">
        <h1 class="lg:text-2xl font-semibold">Holes</h1>
        <hole-data-form @hole-data-emit="handleHoleDataEmit" />
    </div>
    <div class="holesTable">
        <div class="searchBar outline-1 w-[70%] my-8 flex items-center">
            <v-text-field :loading="loading" v-model="courseId" append-inner-icon="mdi-magnify" density="compact"
                label="Search templates" variant="solo" hide-details single-line></v-text-field>
            <!-- <div class="mx-6"> <v-btn color="success" variant="elevated">Search</v-btn></div> -->
        </div>

        <v-data-table-server style="border: 1px solid grey; box-shadow: grey 0px 0px 18px -8px; border-radius: 5px;"
            v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems" :items-length="totalItems"
            :loading="loading" item-value="courseId" v-model="selected" :search="search" return-object
            @update:options="loadItems" show-select>
        </v-data-table-server>
        <div>
            {{ selected }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, defineComponent } from 'vue';
import { JsonForms } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import holeDataSchema, { holeSchemaForUi, testingHoleScehma } from '~/schemas/tournament/holesSchema';

// Reactive state
const page = ref(1);
const itemsPerPage = ref(5);
const search = ref('');
const courseId = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const selectAll = ref(false);
const selected = ref([]);

// Schema and UI schema
const schema = testingHoleScehma;
const uischema = {
    type: 'VerticalLayout',
    elements: [
        {
            type: 'Control',
            scope: '#/properties/holeCount',
        },
    ],
};

// Form data
const data = ref([
    {
        courseId: 'Some Course',
        holeId: 1,
        teePosition: 12,
        windSpeed: '1',
        windDirection: ['right', 'left'],
    },
    {
        courseId: 'Santa fe',
        holeId: 1,
        teePosition: 12,
        windSpeed: '1',
        windDirection: ['right', 'left'],
    },
]);

// Renderer and styles
const renderers = Object.freeze([...vuetifyRenderers]);
const myStyles = mergeStyles(defaultStyles, { control: { label: 'mylabel' } });

// Table headers
const headers = [
    { title: '', key: 'select', align: 'center', sortable: false },
    { title: 'Course ID', key: 'courseId', align: 'left', sortable: false },
    { title: 'Hole ID', key: 'holeId', align: 'end' },
    { title: 'Tee Position', key: 'teePosition', align: 'end' },
    { title: 'Wind Direction', key: 'windDirection', align: 'end' },
];

// Methods
const onChange = (event: { data: any }) => {
    data.value = event.data;
};

const handleHoleDataEmit = (newHoleFormData: any) => {
    console.log(newHoleFormData);
    data.value.push(newHoleFormData); // Add new data to the form data array
    // After adding the new data, reload the items in the table
    loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: '' });
};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy }: { page: number; itemsPerPage: number; sortBy: any }) => {
    loading.value = true;
    FakeAPI.fetch({
        page: p,
        itemsPerPage: ipp,
        sortBy,
        search: { courseId: courseId.value },
    }).then(({ items, total }: { items: any[]; total: number }) => {
        serverItems.value = items;
        totalItems.value = total;
        loading.value = false;
    });
};

// Watchers
watch(courseId, () => {
    search.value = String(Date.now());
});

// Fake API
const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy, search }: { page: number; itemsPerPage: number; sortBy: any; search: { courseId: string } }) {
        console.log('This is Search' + search.courseId);
        return new Promise<{ items: any[]; total: number }>((resolve) => {
            setTimeout(() => {
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const items = data.value.slice().filter((item: any) => {
                    if (search.courseId && !item.courseId.toLowerCase().includes(search.courseId.toLowerCase())) {
                        return false;
                    }
                    return true;
                });

                const paginated = items.slice(start, end);

                resolve({ items: paginated, total: items.length });
            }, 500);
        });
    },
};
</script>
