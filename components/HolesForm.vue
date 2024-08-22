<template>
    <div class="lg:w-[50%]">
        <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />
    </div>
    <div class="flex justify-between mb-8 mt-4">
        <h1 class="lg:text-2xl font-semibold">Holes</h1>
        <hole-data-form />
    </div>
    <div class="holesTable">
        <div class="searchBar outline-1 w-[70%] my-8 flex items-center">
            <v-text-field :loading="loading" v-model="courseId" append-inner-icon="mdi-magnify" density="compact"
                label="Search templates" variant="solo" hide-details single-line
                @click:append-inner="onClick"></v-text-field>
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

<script>
import { JsonForms } from "@jsonforms/vue";
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify'
import holeDataSchema, { holeSchemaForUi } from "~/schemas/tournament/holesSchema";
import holeSchema from "~/schemas/tournament/holesSchema";

let renderers = [
    ...vuetifyRenderers
]

let schema = holeSchemaForUi;

const data = [
    {
        courseId: "Some Course",
        holeId: 1,
        teePosition: 12,
        windSpeed: '1',
        windDirection: ["right", "left"]

    },
    {
        courseId: "Santa fe",
        holeId: 1,
        teePosition: 12,
        windSpeed: '1',
        windDirection: ["right", "left"]

    },

]

const uischema = {
    type: "VertcialLayout",
    elements: [
        {
            type: "Control",
            scope: "#/properties/holeCount",
        }
    ]
}

const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy, search }) {
        console.log("This is Search" + search.courseId)
        return new Promise(resolve => {
            setTimeout(() => {
                const start = (page - 1) * itemsPerPage
                const end = start + itemsPerPage
                const items = data.slice().filter(item => {
                    if (search.courseId && !item.courseId.toLowerCase().includes(search.courseId.toLowerCase())) {
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


// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });
let holeFormData;
const headers = [
    {
        title: '',
        key: 'select',
        align: 'center',
        sortable: false,
    },
    {
        title: "Course ID",
        key: 'courseId',
        align: 'left',
        sortable: false
    },
    { title: 'Hole ID', key: 'holeId', align: 'end' },
    { title: 'Tee Postion', key: 'teePosition', align: 'end' },
    { title: 'Wind Direction', key: 'windDirection', align: 'end' },
];
export default defineComponent({
    name: "Login",
    components: {
        JsonForms,
    },
    data() {
        return {
            // freeze renderers for performance gains
            page: 1,
            itemsPerPage: 5,
            search: '',
            courseId: "",
            serverItems: [],
            loading: true,
            totalItems: 0,
            selectAll: false,
            selected: [],
            headers,
            renderers: Object.freeze(renderers),
            data: holeFormData,
            schema,
            uischema,
        };
    },
    methods: {
        onChange(event) {
            this.data = event.data;
            holeFormData = event.data;
        },

        loadItems({ page, itemsPerPage, sortBy }) {
            this.loading = true
            FakeAPI.fetch({
                page,
                itemsPerPage,
                sortBy,
                search: { courseId: this.courseId },
            }).then(({ items, total }) => {
                this.serverItems = items
                this.totalItems = total
                this.loading = false
            })
        },
    },
    watch: {
        courseId: function () {
            this.search = String(Date.now())
        }
    }
})
</script>
