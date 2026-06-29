import { isEmpty } from 'lodash';
import responseHandler from './ResponseHandler';

const createQueryObject = (url, headers, method, payload) => ({
  data: payload,
  headers,
  method: method ?? 'POST',
  url,
});

const createBuilderFunction =
  (builderFunction) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (url, { headers, defaultPayload = {}, method = 'POST', ...options } = {}) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    builderFunction({
      query: (payload) => createQueryObject(url, headers, method, isEmpty(payload) ? defaultPayload : payload),
      transformResponse: responseHandler,
      ...options,
    });

const createInfiniteQueryBuilderFunction =
  (builderFunction) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (url, { headers, defaultPayload = {}, method = 'POST', infiniteQueryOptions, ...options } = {}) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    builderFunction({
      query: (payload) => createQueryObject(url, headers, method, isEmpty(payload) ? defaultPayload : payload),
      infiniteQueryOptions: {
        initialPageParam: 1,
        maxPages: 3,
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => lastPageParam + 1,
        // eslint-disable-next-line no-confusing-arrow
        getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          firstPageParam > 0 ? firstPageParam - 1 : undefined,
        ...infiniteQueryOptions,
      },
      ...options,
    });

const getBuilders = (builder) => ({
  query: createBuilderFunction(builder.query),
  mutation: createBuilderFunction(builder.mutation),
  infiniteQuery: createInfiniteQueryBuilderFunction(builder.infiniteQuery),
});

export default getBuilders;
