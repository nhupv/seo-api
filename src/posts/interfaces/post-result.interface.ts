import { Post } from './post.interface';
export interface PostResult {
  hits: {
    total: number;
    hits: Array<{
      _source: Post;
    }>;
  };
}
