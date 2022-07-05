export interface Post {
  post_id: string;
  iso_time: Date;
  post_date: Date;
  title: string;
  article: string;
  snippet: string;
  crawler_tags: string;
  bot_code: string;
  link: string;
  category: string;
  source_category: string;
  delimiter: string;
  mention_sentence: string;
  source: string;
  author: string;
}
export const POST_INDEX = process.env.POST_INDEX;
