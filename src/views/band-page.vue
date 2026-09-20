<script setup>
// Shared reactive content supplies the biography and lineup and updates after a reload.
import { content } from '../lib/content'
</script>
<template>
  <div class="wrap page">
    <p class="eyebrow">THE BAND / EST. 2016</p>
    <h1>FORGED IN<br /><span>DISTORTION.</span></h1>
    <div class="story-layout">
      <h2>No master plan.<br />Just heavy riffs.</h2>
      <div class="prose">
        <!-- Blank lines in the saved biography separate its paragraphs. -->
        <p v-for="(paragraph, index) in content.story.split('\n\n')" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </div>
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">THE CURRENT LINEUP</p>
          <h2>Meet the noise makers<span>.</span></h2>
        </div>
      </div>
      <div class="member-grid">
        <!-- Stable IDs keep each card tied to its member if the lineup is reordered. -->
        <article v-for="(member, index) in content.members" :key="member.id" class="member-card">
          <div class="portrait">
            <!-- Use the band logo when a member has no photo URL. -->
            <img :src="member.image || '/Logo.png'" :alt="member.name" loading="lazy" /><span
              >0{{ index + 1 }}</span
            >
          </div>
          <p class="eyebrow">{{ member.role }}</p>
          <h3>{{ member.name }}</h3>
          <p>{{ member.bio }}</p>
        </article>
      </div>
    </section>
  </div>
</template>
