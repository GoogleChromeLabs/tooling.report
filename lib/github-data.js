import fetch from 'node-fetch';
import Cache from 'async-disk-cache';
import * as config from '../config.js';

const ghCache = new Cache('ghCache');

const updateCache = !!process.env.UPDATE_CACHE;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

let warnedAboutAuth = false;

export async function getGithubDataForIssue(url) {
  // old cache key:
  if (!updateCache && (await ghCache.has(url))) {
    const { value } = await ghCache.get(url);
    return JSON.parse(value);
  }
  const [, repo, type, id] =
    url.match(/([^/]+\/[^/]+)\/(issue|pull)s?\/(\d+)/i) || [];
  return await githubApi(
    `/repos/${repo}/${type}s/${id}`,
    ({ title, state }) => ({ title, status: state }),
  );
}

// async function getGithubDataForIssue(url) {
//   if (!updateCache && (await ghCache.has(url))) {
//     const { value } = await ghCache.get(url);
//     return JSON.parse(value);
//   }
//   const [, repo, type, id] =
//     url.match(/([^/]+\/[^/]+)\/(issue|pull)s?\/(\d+)/i) || [];
//   const res = await fetch(
//     `https://api.github.com/repos/${repo}/${type}s/${id}`,
//   );
//   const { title, state: status } = await res.json();
//   const githubData = {
//     title,
//     status,
//   };
//   await ghCache.set(url, JSON.stringify(githubData));
//   return githubData;
// }

const contribDataRequests = [];
let isSendingBatch = false;

function requestContribData(path) {
  const id = 'contrib' + contribDataRequests.length;

  return new Promise((resolve, reject) => {
    const len = contribDataRequests.push({
      id,
      path,
      resolve,
      reject,
    });

    if (len === 1 && !isSendingBatch) {
      setTimeout(submitBatchContribRequest, 200);
    }
  });
}

async function submitBatchContribRequest() {
  const reqs = contribDataRequests.slice();
  contribDataRequests.length = 0;
  // prevent concurrent batched requests:
  isSendingBatch = true;

  const [, org, repo] = config.githubRepository.match(/\/([^/]+)\/([^/]+)\/?$/);
  const branch = 'dev';

  // Create aliased queries for every path (yep)
  const historyQueries = reqs.map(
    ({ id, path }) => `
      ${id}: history(path: ${JSON.stringify(path)}) {
        ... author
      }
    `,
  );

  const query = `
    query {
      repository(owner: ${JSON.stringify(org)}, name: ${JSON.stringify(repo)}) {
        object(expression: ${JSON.stringify(branch)}) {
          ... on Commit {
            ${historyQueries.join('\n')}
          }
        }
      }
    }
    
    fragment author on CommitHistoryConnection {
      nodes {
        author {
          user { name avatarUrl login }
        }
      }
    }
  `;

  try {
    const data = await graphql(query);

    for (const req of reqs) {
      const result = data.repository.object[req.id];
      req.resolve(result.nodes);
      //.history.nodes
    }
  } catch (e) {
    console.log(`Failed to get contribution data: ${e}`);
    for (const req of reqs) {
      req.reject(e);
    }
  }

  isSendingBatch = false;
  if (contribDataRequests.length > 0) {
    submitBatchContribRequest();
  }
}

export async function getContributorsForPath(path) {
  // Contributor data is cached individually for each path.
  // (cache misses result in batched GraphQL queries)
  const cacheKey = `contribdata::${path}`;
  if (!updateCache && (await ghCache.has(cacheKey))) {
    const { value } = await ghCache.get(cacheKey);
    return JSON.parse(value);
  }

  // Warn about a missing token (once):
  if (!GITHUB_TOKEN) {
    if (!warnedAboutAuth) {
      console.warn('Unable to get contributor data, no GITHUB_TOKEN provided.');
      warnedAboutAuth = true;
    }
    return;
  }

  // trim leading and trailing slashes
  path = path.replace(/(^\/?|\/?$)/g, '');

  const commits = await requestContribData(path);
  const contribs = aggregateContributorData(commits);
  await ghCache.set(cacheKey, JSON.stringify(contribs));
  return contribs;
}

function aggregateContributorData(history) {
  const contributors = history.reduce((contribs, commit) => {
    const { login } = commit.author.user;
    const contrib = contribs.get(login);
    if (contrib) {
      contrib.commits++;
    } else {
      contribs.set(login, {
        ...commit.author.user,
        commits: 1,
      });
    }
    return contribs;
  }, new Map());

  return Array.from(contributors.values());
}

async function graphql(query, variables, reduce) {
  if (!reduce) {
    reduce = variables;
    variables = null;
  }
  return await githubApi(
    `/graphql`,
    res => {
      const { data, errors } = res;
      if (errors) throw Error(errors[0].message);
      return reduce ? reduce(data) : data;
    },
    {
      method: 'POST',
      bearer: true,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    },
  );
}

async function githubApi(url, reduce, options = {}) {
  const key = options.body || url;
  if (!updateCache && (await ghCache.has(key))) {
    const { value } = await ghCache.get(key);
    return JSON.parse(value);
  }
  const res = await fetch(`https://api.github.com${url}`, {
    ...options,
    headers: {
      ...Object.values(options.headers || {}),
      Authorization: GITHUB_TOKEN
        ? `${options.bearer ? 'bearer' : 'token'} ${GITHUB_TOKEN}`
        : '',
    },
  });
  const data = reduce(await res.json());
  await ghCache.set(key, JSON.stringify(data));
  return data;
}
