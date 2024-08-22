<template>
    <v-dialog max-width="700" :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="blue" prepend-icon="mdi-clipboard">Edit</v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                <v-card-text>
                    <v-form>
                        <v-item-group selected-class="bg-primary">
                            <v-container>
                                <v-row>
                                    <v-col v-for="n in 15" :key="n" cols="12" md="4">
                                        <v-item v-slot="{ isSelected, selectedClass, toggle }">
                                            <v-card :class="['d-flex align-center', selectedClass]" height="200" dark
                                                @click="() => {
                                                    onIconSelect(toggle, n.toString());
                                                }">
                                                <div class="text-h3 flex-grow-1 text-center">
                                                    {{ isSelected ? 'Selected' : 'Click Me!' }}
                                                </div>
                                            </v-card>
                                        </v-item>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-item-group>

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
export default {
    data: () => {

    },
    methods: {
        onIconSelect: function (callback: (() => void) | undefined, n:string) {
            alert("selected is "+ n)
            if (callback !== undefined)
                callback();
        }
    }
}
</script>