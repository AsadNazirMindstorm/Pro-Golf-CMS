<template>
    <div class="flex">
        <div class="w-[60%]">
            <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />
        </div>

        <div class="w-[40%]">

            <!-- Displaying icon number for testing purposes -->
            <h1>{{ data.icon }}</h1>
            <!-- --------------------------- -->
            <edit-icon :icon="data.icon" @icon="handleIconChange" />
            <div class="p-10">
                <v-img cover sizes="small" src="../assets/pngwing.com.png"></v-img>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import metaSchema from '~/schemas/tournament/metaSchema';
import { type Meta } from '~/schemas/tournament/metaSchema';

// Define the renderers and schema
const renderers = Object.freeze([...vuetifyRenderers]);
const schema = metaSchema;

// UI schema for the JSON form
const uischema = {
    type: 'VerticalLayout',
    elements: [
        {
            type: 'Control',
            scope: '#/properties/category',
        },
        {
            type: 'Control',
            scope: '#/properties/title',
        },
        {
            type: 'Control',
            scope: '#/properties/league',
        },
    ],
};

// Initial form data
const metaFormData: Meta = {
    league: 'Change Me',
    category: 'Change Me',
    title: 'Change Me',
    icon: '1',
};

// Reactive state
const data = ref(metaFormData);

//define emitters for this data

const emit = defineEmits(['metaFormDataEmit'])

// Event handlers
const onChange = (event: JsonFormsChangeEvent) => {
    data.value = event.data;
    //Emitting the Data when it is changed
    emit("metaFormDataEmit", data.value);
};

const handleIconChange = (newIcon: string) => {
    data.value.icon = newIcon;
};


</script>