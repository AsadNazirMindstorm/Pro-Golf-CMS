<template>
    <v-dialog max-width="900" :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" prepend-icon="mdi-eye" class="me-2"  @click="handleOpen">
                View
            </v-btn>
        </template>
        <!-- <pre>
        {{ oldData }}
    </pre>
    <pre>
        {{ newData }}
    </pre> -->

        <template v-slot:default="{ isActive }">
            <v-card>
                <div style="padding: 2rem 1rem;" v-html="formattedDiff"></div>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import * as Diff from 'diff';


//defining props
const props = defineProps({
    newJson: Object,
    oldJson: Object
})

//hanle open function
const handleOpen = () => {
    alert("Hello");
}
// Example data
const oldData = ref<object>(props.oldJson || {});
const newData = ref<object>(props.newJson || {});
// Function to stringify and format JSON for diff
const stringifyJSON = (obj: object | undefined) => JSON.stringify(obj, null, 2);



// Compute the diff
const diff = Diff.diffJson(oldData.value, newData.value);

// Format the diff for display
const formattedDiff = computed(() => {
    return diff.map(part => {
        if (part.added) {
            return `<div style="background-color: #d4f4dd; color: green;">+ ${part.value.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}</div>`;
        } else if (part.removed) {
            return `<div style="background-color: #f8d7da; color: red;">- ${part.value.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}</div>`;
        } else {
            return part.value.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
        }
    }).join('');
});



</script>

<style scoped>
/* Optional: additional styling */
div {
    padding: 2px;
    margin: 2px 0;
    border-radius: 3px;
    font-family: monospace;
}
</style>
