import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import insightsData from "./insights.json";
import "./Insights.css";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const foundArticle = insightsData.find((a) => a.id.toString() === id);
    if (foundArticle) {
      // Hero image from src/assets
      try {
        foundArticle.heroImage = require(`../assets/${foundArticle.image}`);
      } catch {
        foundArticle.heroImage = null;
      }

      // No images inside content needed
      foundArticle.processedContent = foundArticle.content;

      setArticle(foundArticle);
    } else {
      setArticle(null);
    }
  }, [id]);

  if (!article) {
    return (
      <div className="article-page">
        <div className="article-wrapper">
          <h1>Article Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
      {article.heroImage && (
        <div className="article-hero">
          <img className="hero-img" src={article.heroImage} alt={article.title} />
        </div>
      )}

      <div className="article-wrapper">
        <h1 className="article-title">{article.title}</h1>
        {article.topic && <p className="article-topic">{article.topic}</p>}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: marked.parse(article.processedContent) }}
        />
      </div>
    </div>
  );
}
