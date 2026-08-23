import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, any> | Record<string, any>[];
  publishedAt?: string;
  updatedAt?: string;
  keywords?: string;
};

const SITE = "";

const Seo = ({ title, description, path = "/", image = "/og.jpg", type = "website", jsonLd, publishedAt, updatedAt, keywords }: Props) => {
  const url = `${SITE}${path}`;
  const img = image.startsWith("http") ? image : `${SITE}${image}`;
  const ld = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {updatedAt && <meta property="article:modified_time" content={updatedAt} />}
      {ld.map((j, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(j)}</script>
      ))}
    </Helmet>
  );
};

export default Seo;