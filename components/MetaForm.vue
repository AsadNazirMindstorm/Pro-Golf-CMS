<template>
    <div class="flex">
        <div class="w-[60%]">
            <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />
        </div>

        <div class="w-[40%] p-10">

            <!-- Displaying icon number for testing purposes -->
            <!-- <h1>{{ data.icon }}</h1> -->
            <!-- --------------------------- -->
            <edit-icon :icon="data.icon" @icon="handleIconChange" />
            <div class="w-full">
                <v-img style="width: 70%;" :src="tournamentIconsArrays[Number(data.icon) - 1].img"></v-img>
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
import { defaultMetaFormData } from '~/constants/FormConstants';
import { tournamentIconsArrays } from '~/constants/FormConstants';

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
            options: {
                readonly: true
            }
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

// Initial form data (Change it from the constants folder)
const metaFormData: Meta = defaultMetaFormData;

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

//Emitter handler for Icon Change in Meta form
const handleIconChange = (newIcon: string) => {
    data.value.icon = newIcon;
};


</script>