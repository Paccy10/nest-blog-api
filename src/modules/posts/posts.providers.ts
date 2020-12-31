import { POST_REPOSITORY } from './../../core/constants/index';
import { Post } from './post.entity';

export const postsProviders = [
  {
    provide: POST_REPOSITORY,
    useValue: Post,
  },
];
