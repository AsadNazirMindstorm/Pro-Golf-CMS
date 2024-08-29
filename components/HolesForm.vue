<template>
    <div class="lg:w-[50%]">
        <json-forms :data="holeDataForForm" :renderers="renderers" :schema="schema" :uischema="uischema"
            @change="onChange" />
    </div>
    <div class="flex justify-between mb-8 mt-4">
        <h1 class="lg:text-2xl font-semibold">Holes</h1>
        <hole-data-form :is-open="openCreateDiaolougueBox" :is-created-disabled="isCreateDisabled" @hole-data-emit="handleHoleDataEmit" />
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

            <template v-slot:item.actions="{ item }">
                <v-icon class="me-2" size="small" @click="handleEdit(item)">
                    mdi-pencil
                </v-icon>
                <v-icon class="me-2" size="small" @click="handleDelete(item)">
                    mdi-delete
                </v-icon>
                <v-icon class="me-2" size="small" @click="">
                    mdi-content-copy
                </v-icon>
                <v-icon size="small" @click="">
                    mdi-content-duplicate
                </v-icon>
            </template>
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
import holeDataSchema, { holeSchemaForUi, testingHoleScehma, type HoleData, type Holes } from '~/schemas/tournament/holesSchema';
import { defaultHoleData, defualtHoleFormData } from '~/constants/FormConstants';
import type { Tournament } from '~/schemas/tournamentSchema';

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
const isCreateDisabled = ref<boolean>(true);
const openCreateDiaolougueBox = ref<boolean>(false);

// Schema and UI schema
const schema = testingHoleScehma;
const uischema = {
    type: 'HorizontalLayout',
    elements: [
        {
            type: 'Control',
            scope: '#/properties/holeCount',
        },
        {
            type: 'Control',
            scope: '#/properties/isRandom'
        }
    ],
};

//State for maintaining data for editing of hole data entry
const holeDataState = useState<HoleData | null>('holeData', () => null);
const isOpen = useState<boolean>('isOpen', ()=>false);

const tournamentData = useState<Tournament | null>('tournamentData');

let holeDataForForm = ref<Holes>(tournamentData?.value?.holeData || defualtHoleFormData);

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
    { title: 'Actions', key: 'actions', align: 'center' },
];

// emit for Hole data to parent
const emit = defineEmits(['holeFormEmit']);

onMounted(() => {
    // console.log("on Mounted tournament is ", tournamentData.value);
    if (tournamentData.value === null)
        holeDataForForm.value.holeData = [];
})

// Methods
const onChange = (event: { data: any }) => {
    holeDataForForm.value = event.data;
    console.log('count', holeDataForForm.value.holeCount);

    //disabling the create when the value is less than 1
    if (holeDataForForm.value.holeCount !== undefined && holeDataForForm.value.holeCount > 0)
        isCreateDisabled.value = false;

    else isCreateDisabled.value = true;

    emit('holeFormEmit', holeDataForForm.value);
};

const handleHoleDataEmit = (newHoleFormData: any) => {
    console.log(newHoleFormData);
    // holeDataForForm.value.holeData = holeDataForForm.value;
    holeDataForForm.value.holeData.push(newHoleFormData); // Add new data to the form data array
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

// Delete Handler
const handleDelete = (item: any) => {
    // Ensure that item has the index property and it's valid
    if (item.index !== undefined && item.index >= 0 && item.index < holeDataForForm.value.holeData.length) {
        // Create a new array without the item at the specified index
        holeDataForForm.value.holeData = holeDataForForm.value.holeData.filter((_, idx) => idx !== item.index);

        // Reload items with the current page and other parameters
        loadItems({
            page: page.value,
            itemsPerPage: itemsPerPage.value,
            sortBy: []
        });
    } else {
        console.error('Invalid index for deletion');
    }
}

const handleDuplicate = (item: any) => {

}

const handleEdit = (item: any) => {
    isOpen.value=true;
    holeDataState.value = item;
}

// Fake API
const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy, search }: { page: number; itemsPerPage: number; sortBy: any; search: { courseId: string } }) {
        console.log('This is Search' + search.courseId);
        return new Promise<{ items: any[]; total: number }>((resolve) => {
            setTimeout(() => {
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const items = holeDataForForm.value.holeData.slice().filter((item: any) => {
                    if (search.courseId && !item.courseId.toLowerCase().includes(search.courseId.toLowerCase())) {
                        return false;
                    }
                    return true;
                });

                const paginated = items.slice(start, end);

                paginated.forEach((ele, index) => {
                    Object.defineProperty(ele, 'index', {
                        value: index,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                });

                resolve({ items: paginated, total: items.length });
            }, 500);
        });
    },
};
</script>
