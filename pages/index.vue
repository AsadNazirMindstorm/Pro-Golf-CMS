<template>
    <div>
        <json-forms 
        :data="data" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />
    </div>
</template>

<script lang="ts">
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue";

</script>