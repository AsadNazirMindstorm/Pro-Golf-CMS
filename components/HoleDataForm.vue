<template>
    <v-dialog max-width="500" :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="blue" prepend-icon="mdi-plus">Create</v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                <v-card-text>
                    <v-form>
                        <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema"
                            @change="onChange" />
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green" @click="handleHoleDataSubmit">Save</v-btn>
                    <v-btn text="Close Dialog" @click="() => { data = defaultHoleData; isActive.value = false }"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import { holeDataSchema } from '~/schemas/tournament/holesSchema';
import { type HoleData } from '~/schemas/tournament/holesSchema';
import { defaultHoleData } from '~/constants/FormConstants';

// Define the renderers and schema
const renderers = Object.freeze([...vuetifyRenderers]);
const schema = holeDataSchema;


const emit = defineEmits(['holeDataEmit']);

let holeDataFormData: HoleData = defaultHoleData;
let data = ref(holeDataFormData);

// UI schema for the JSON form
const uischema = {
    type: 'VerticalLayout',
    elements: [
        {
            type: 'Control',
            scope: '#/properties/courseId',
        },
        {
            type: 'Control',
            scope: '#/properties/holeId',
        },
        {
            type: 'Control',
            scope: '#/properties/windSpeed',
        },
        {
            type: "Group",
            label: "Wind Direction",
            elements: [
                {
                    type: 'Control',

                    scope: '#/properties/windDirection',
                }
            ]
        },
    ]
};

const onChange = (event: JsonFormsChangeEvent) => {
    data.value = event.data;
}

const handleHoleDataSubmit = () => {
    console.log(data.value);
    //Emmitting the Data to the Parent
    emit("holeDataEmit", data.value);
}


</script>