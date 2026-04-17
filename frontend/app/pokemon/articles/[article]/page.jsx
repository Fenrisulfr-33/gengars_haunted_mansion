"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import ArticleContainer from "@/components/articles/ArticleContainer";

export default function Article({ params }) {
  const { article } = use(params);
  const Content = dynamic(
    () => import(`@/articles/pokemon/${article}.mdx`),
    {}
  );

  return (
    <ArticleContainer>
      {Content ? <Content /> : <div>Not found</div>}
    </ArticleContainer>
  );
}
