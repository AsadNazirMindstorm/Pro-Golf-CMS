<template>
    <json-forms :data="availabilityFormData" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />

</template>

<script setup lang="ts">
import { ref, computed, watch, defineComponent } from 'vue';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import holeDataSchema, { holeSchemaForUi } from '~/schemas/tournament/holesSchema';
import { AvailabilitySchema, type Availability } from '~/schemas/tournament/availabiltySchema';
import { defaultAvailabiltyFormData } from '~/constants/FormConstants';
import type { Tournament } from '~/schemas/tournamentSchema';


// Renderer and styles
const renderers = Object.freeze([...vuetifyRenderers]);
const myStyles = mergeStyles(defaultStyles, { control: { label: 'mylabel' } });


const tournamentData = useState<Tournament | null>('tournamentData');

let availabilityFormData = ref<Availability>(tournamentData?.value?.availabiltyData || defaultAvailabiltyFormData);
console.log(availabilityFormData.value);
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

const emit = defineEmits(['AvailabiltyFormDataEmit']);

const onChange = (event: JsonFormsChangeEvent) => {
    availabilityFormData.value = event.data;

    //Emitting the data to the parent
    emit('AvailabiltyFormDataEmit', availabilityFormData.value);
}

</script>