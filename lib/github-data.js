import fetch from 'node-fetch';
import Cache from 'async-disk-cache';
import * as config from '../config.js';

const ghCache = new Cache('ghCache');

const updateCache = !!process.env.UPDATE_CACHE;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

let warnedAboutAuth = false;

export async function getGithubDataForIssue(url) {
  const [, repo, type, id] =
    url.match(/([^/]+\/[^/]+)\/(issue|pull)s?\/(\d+)/i) || [];
  return await githubApi(
    `/repos/${repo}/${type}s/${id}`,
    ({ title, state }) => ({ title, status: state }),
  );
}

export async function getContributorsForPath(path) {
  if (!GITHUB_TOKEN) {
    if (!warnedAboutAuth) {
      console.warn('Unable to get contributor data, no GITHUB_TOKEN provided.');
      warnedAboutAuth = true;
    }
    return;
  }

  // trim leading and trailing slashes
  path = path.replace(/(^\/?|\/?$)/g, '');

  // await githubApi(encode`/repos/${owner}/${repo}/commits?path=${path}`);

  // const [, repo] = config.githubRepository.match(/\/([^/]+\/[^/]+)\/?$/);
  // const commits = await githubApi(
  //   `/repos/${repo}/commits?path=${encodeURIComponent(path)}`,
  // );

  const [, org, repo] = config.githubRepository.match(/\/([^/]+)\/([^/]+)\/?$/);

  const query = gql`{
    repository(owner: ${org}, name: ${repo}) {
      object(expression: "master") {
        ... on Commit {
          history(path: ${path}) {
            nodes {
              author {
                user { name avatarUrl login }
              }
            }
          }
        }
      }
    }
  }`;

  const contribs = await graphql(query, aggregateContributorData);

  return contribs;
}

function aggregateContributorData(data) {
  const history = data.repository.object.history.nodes;

  const contributors = history.reduce((contribs, commit) => {
    const { user } = commit.author;
    let contrib = contribs[user.login];
    if (!contrib) {
      contrib = contribs[user.login] = {
        ...user,
        commits: 0,
      };
    }
    contrib.commits++;
    return contribs;
  }, {});

  return Object.values(contributors);
}

function gql(strings, ...args) {
  let out = strings[0];
  for (let i = 0; i < args.length; ) {
    out += JSON.stringify(args[i]);
    out += strings[++i].replace(/[\s\n]+/g, ' ');
  }
  return out;
}
// const gql = (str, ...args) => str.reduce((out, str, i) => `${out}${str}${i < args.length ? JSON.stringify(args[i]) : ''}`, '');

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
      return reduce(data);
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
