<template>
    <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />

</template>

<script setup lang="ts">
import { ref, computed, watch, defineComponent } from 'vue';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import holeDataSchema, { holeSchemaForUi } from '~/schemas/tournament/holesSchema';
import { AvailabilitySchema, type Availability } from '~/schemas/tournament/availabiltySchema';
import { defaultAvailabiltyFormData } from '~/constants/FormConstants';


// Renderer and styles
const renderers = Object.freeze([...vuetifyRenderers]);
const myStyles = mergeStyles(defaultStyles, { control: { label: 'mylabel' } });

let availabilityFormData: Availability = defaultAvailabiltyFormData;

let data = ref(availabilityFormData);

let schema = AvailabilitySchema;
// UI schema for the JSON form
const uischema = {
    type: "VerticalLayout",
    elements: [
        {
            type: "Group",
            label: "Availability",
            elements: [
                {
                    type: 'HorizontalLayout',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/startDateTime',
                        },
                        {
                            type: 'Control',
                            scope: '#/properties/endDateTime',
                        },
                    ],
                }
            ]
        },
        {
            type: "Group",
            label: "Time",
            elements: [
                {
                    type: 'HorizontalLayout',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/userPlayTime',
                        },
                        {
                            type: 'Control',
                            scope: '#/properties/totalTime',
                        },
                    ],
                }
            ]
        }
    ]
}

const onChange = (event: JsonFormsChangeEvent) => {
    data.value = event.data;

    availabilityFormData = data.value;
}

</script>