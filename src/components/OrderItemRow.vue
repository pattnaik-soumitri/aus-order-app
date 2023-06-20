<template>
    <div class="grid">
        <label for="items">
            Items
            <select id="items" required>
            <option value="" selected>Select an item</option>
            <option>…</option>
            </select>
        </label>

        <label for="quantity">
        Qty
        <input type="number" id="quantity" name="quantity" placeholder="Qty" required>
        </label>
    </div>
</template>