import { newsArticles } from '../data/newsData.js';
import { createSourceStatus, SOURCE_TYPES } from './sourceStatus.js';

const records = Object.freeze(newsArticles.map((article) => Object.freeze({ ...article })));
const sourceStatus = createSourceStatus(SOURCE_TYPES.STATIC_REPOSITORY, {
  redeployRequired: true,
});

export function isPublicKabar(article) {
  return article.visibility === 'Publik' && article.status === 'Siap publik';
}

export const kabarRepository = Object.freeze({
  getAll: () => records,
  getPublic: () => records.filter(isPublicKabar),
  getById: (id) => records.find((article) =>
    String(article.id) === String(id) || article.slug === id,
  ) ?? null,
  getSourceStatus: () => sourceStatus,
});
