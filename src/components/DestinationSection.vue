<script setup lang="ts">
// Unsplash image for Greece (fallback if generation fails)
const imgUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
</script>

<template>
  <section class="destinations" id="destinations">
    <h2 class="section-title highlight-underline">Explore Destinations</h2>
    <div class="destinations__grid">
      <article class="destination-card">
        <img :src="imgUrl" alt="Santorini, Greece" class="destination-card__img" />
        <div class="destination-card__info">
          <h3 class="destination-card__title">Santorini, Greece</h3>
          <p class="destination-card__desc">White-washed houses, iconic blue domes, and breathtaking sunsets over the Aegean Sea.</p>
          <a href="#" class="destination-card__link">Learn More →</a>
        </div>
      </article>
      <!-- You can duplicate card for more destinations later -->
    </div>
  </section>
</template>

<style scoped>

</style>
