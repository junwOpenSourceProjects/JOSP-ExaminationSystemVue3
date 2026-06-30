<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-6 py-[var(--spacing-hero)] text-center">
    <h1 class="text-4xl md:text-6xl font-semibold tracking-tight text-[var(--color-ink)] mb-6">
      考研成绩查询系统
    </h1>
    <p class="text-lg md:text-xl text-[var(--color-steel)] max-w-2xl mb-10 leading-relaxed">
      欢迎使用 JOSP-ExaminationSystemVue3。本系统用于研究生考试成绩、院校分数线、学院分数线等数据的查询与管理。
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4">
      <UButton
        size="md"
        class="rounded-full px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold hover:bg-[var(--color-charcoal)]"
      >
        查询学生成绩
      </UButton>
      <UButton
        variant="outline"
        size="md"
        class="rounded-full px-6 py-3 border border-[var(--color-ink)] text-[var(--color-ink)] font-semibold hover:bg-[var(--color-surface)]"
      >
        院校分数线
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '考研成绩查询系统'
})
</script>
