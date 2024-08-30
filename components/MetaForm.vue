<template>
    <div class="flex">
        <div class="w-[60%]">
            <json-forms :data="metaFormData" :renderers="renderers" :schema="schema" :uischema="uischema"
                @change="onChange"/>
        </div>

        <div class="w-[40%] p-10">

            <!-- Displaying icon number for testing purposes -->
            <!-- <h1>{{ data.icon }}</h1> -->
            <!-- --------------------------- -->
            <edit-icon :icon="metaFormData.icon" @icon="handleIconChange" />
            <div class="w-full">
                <v-img style="width: 70%;" :src="tournamentIconsArrays[Number(metaFormData.icon) - 1].img"></v-img>
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
import type { Tournament } from '~/schemas/tournamentSchema';

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

const tournamentData = useState<Tournament | null>('tournamentData');

// console.log("Tournament data in meta form", tournamentData.value?.metaData);
const metaFormData = ref<Meta>(tournamentData.value?.metaData || defaultMetaFormData);

//define emitters for this data
const emit = defineEmits(['metaFormDataEmit'])

// Event handlers
const onChange = (event: JsonFormsChangeEvent) => {
    metaFormData.value = event.data;
    //Emitting the Data when it is changed
    emit("metaFormDataEmit", metaFormData.value);
};

//Emitter handler for Icon Change in Meta form
const handleIconChange = (newIcon: string) => {
    metaFormData.value.icon = newIcon;
};


</script>