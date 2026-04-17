"use client";

import { use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ArticleContainer from "@/components/articles/ArticleContainer";

const ArticlesLink = () => (
  <div className={`p-2 text-center`}>
    <Link href={`/articles`} passHref>
      <button className={`button`}>{`< Articles`}</button>
    </Link>
  </div>
);

export default function ArticlePage({ params }) {
  const { article } = use(params);
  const Content = dynamic(() =>
    import(`@/articles/main/${article}.mdx`)
  );

  return (
    <div className={`flex flex-col`}>
      <ArticlesLink />
      <ArticleContainer>
        <Content />
      </ArticleContainer>
      <ArticlesLink />
    </div>
  );
}
