"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import ArticleContainer from "@/components/articles/ArticleContainer";

export default function ArticlePage({ params }) {
  const { slug } = use(params);
  const Content = dynamic(() =>
    import(`@/articles/pokemon/scarlet-violet/${slug}.mdx`)
  );

  return (
    <ArticleContainer>
      <Content />
    </ArticleContainer>
  );
}
