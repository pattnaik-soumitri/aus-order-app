<template>
	<div class="pagination">
	      <button @click="gotoPage(page - 1)" :disabled="page === 1">Previous</button>
	      <span>Page {{ page }}</span>
	      <button @click="gotoPage(page + 1)" :disabled="page === pageCount">Next</button>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
	page: Number,
	pageCount: Number
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
.pagination {
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin: 3rem 6rem;
}

.pagination button {
	width: 250px;
	text-align: center;
	margin: 0;
	padding: 1rem 2rem;
}

.pagination span {
	padding: 0.5rem 3rem;
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
}
</style>
