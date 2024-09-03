<template>
    <v-dialog max-width="500" :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="blue" prepend-icon="mdi-clipboard">Paste Tournament</v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                <v-card-text>
                    <v-form>
                        <v-textarea v-model="title" label="Enter the Tournament in JSON Form"
                            style="font-family: 'Courier New', Courier, monospace;" counter single-line></v-textarea>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn @click="parseJson(isActive)">Parse JSON</v-btn>
                    <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAjv } from '~/composable/Ajv';
import metaSchema from '~/schemas/tournament/metaSchema';
import type { Tournament } from '~/schemas/tournamentSchema';
import AvailabilityForm from './AvailabilityForm.vue';
import { AvailabilitySchema } from '~/schemas/tournament/availabiltySchema';
// Bind this to the v-model in the template
const title = ref('');

// Function to parse the JSON
const parseJson = async (isActive: any) => {
    try {
        const parsedData: Tournament = JSON.parse(title.value);
        // console.log('Parsed Data:', parsedData);

        if (parsedData.metaData != undefined || parsedData != null) {

            //creating a new UUID for the copy
            parsedData.metaData.category = crypto.randomUUID();
        }

        if (!useAjv().validate(metaSchema, parsedData.metaData))
            throw new Error();
        if (!useAjv().validate(AvailabilitySchema, parsedData.availabiltyData))
            throw new Error();
        if (!useAjv().validateHoleForm(parsedData.holeData))
            throw new Error();

        const res = await $fetch('/api/copyTournament', {
            method: 'POST',
            body: JSON.stringify(parsedData)
        })


        if (res.success) {
            alert("Entered Succesfully")
        }

        else {
            alert("error");
        }

        isActive.value = false;
        // You can use parsedData here as needed
        // For example, you might want to store it in a state or do further processing
    } catch (error) {
        alert('Failed to parse JSON. Please ensure the format is correct.');
        console.error('JSON Parsing Error:', error);
    }
};


</script>
