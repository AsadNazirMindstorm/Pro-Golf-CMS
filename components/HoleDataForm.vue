<template>
    <v-dialog max-width="500" :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="blue" prepend-icon="mdi-plus">Create</v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                <v-card-text>
                    <v-form>
                       This is Hole Data Form
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts">

</script>