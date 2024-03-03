/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import {sortBy} from '../utils/jsUtils';
import ArticleList from '@site/src/data/articles.json'
import type { TagType } from './Tags';

// Add articles to this list
// prettier-ignore
const Articles: Article[] = ArticleList;

export type Article = {
  title: string;
  description: string;
  preview: string | null;
  website: string;
  source: string | null;
  tags: TagType[];
};

function sortArticles() {
  let result = Articles;
  // Sort by site name
  result = sortBy(result, (article) => article.title.toLowerCase());
  // Sort by favorite tag, favorites first
  result = sortBy(result, (article) => !article.tags.includes('favorite'));
  return result;
}

export const sortedArticles = sortArticles();
