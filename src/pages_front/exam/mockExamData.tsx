export const examCardData = Array.from({ length: 23 }).map((_, i) => ({
    href: '/examdetail',
    title: `测试题目 ${i}`,
    avatar: `https://joesch.moe/api/v1/random?key=${i}`,
    description: '考试时间：2022.5.30 19:00-20:00',
    content: '全国执业兽医资格考试分为基础、预防、临床和综合应用4门科目，报考人员可以选择报考全部4门科目，也可以选择报考部分科目',
  }));
  