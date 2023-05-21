import { useState } from 'react'; // 添加useState
import Layout from '../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import Date from '../components/date';
import utilStyles from '../../styles/utils.module.css';
import Replicate from "replicate";

export default function Post({ postData }) {
  // 添加一个状态用来控制生成摘要的显示和隐藏
  const [summary, setSummary] = useState(''); 
  // 生成文章的摘要
  async function  generateSummary() {
    const content = postData.contentHtml.replace(/<[^>]+>/g, '');
    const prompt = `摘要:${content}`;
    const body = {
      prompt,
    }
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let prediction = await response.json();
    console.log("prediction final", prediction);
    setSummary(prediction);
  }
  const onSubmit = (e) => {
    generateSummary();
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        {/* 添加一个按钮 */}
        <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
          <div className="flex mt-4">
              <button
              type="submit"
            >
              生成摘要
            </button>
          </div>
        </form>
        {/* 显示摘要 */}
        {summary && <p>{summary}</p>}
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}