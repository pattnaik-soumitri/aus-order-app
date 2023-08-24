<template>
	<div class="pagination">
		<a @click="gotoPage(page - 1)" :disabled="page === 1">&laquo;</a>
		<a v-for="pageNumber in visiblePages" 
			:key="pageNumber" 
			@click="gotoPage(pageNumber)"
			:class="{ active: page === pageNumber }">
			{{ pageNumber }}
		</a>
		<a @click="gotoPage(page + 1)" :disabled="page === pageCount">&raquo;</a>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
	page: Number,
	pageCount: Number,
	maxVisiblePages: { 
		type: Number, 
		default: 5 
	},
});

const visiblePages = computed(() => {
	const halfMaxVisiblePages = Math.floor(props.maxVisiblePages / 2);
	const start = Math.max(1, props.page - halfMaxVisiblePages);
	const end = Math.min(props.pageCount, start + props.maxVisiblePages - 1);
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// emit the goto-page from pagination to parent orderlist

// this defineEmits will let the parent component know about this emit
const emit = defineEmits(['gotoPage']);
const gotoPage = (pageNumber) => {
	if (pageNumber >= 1 && pageNumber <= props.pageCount) {
		emit('gotoPage', pageNumber);
	}
};
</script>

<style scoped>
/* Add your pagination styles here */
</style>
