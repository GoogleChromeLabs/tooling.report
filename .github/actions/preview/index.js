import { exec } from '@actions/exec';
import { getInput, startGroup, endGroup, setFailed, setOutput } from '@actions/core';
import { GitHub, context } from '@actions/github';

async function run(github, context) {
    const { number: pull_number } = context.issue

    startGroup('Installing dependencies');
    await exec('npm', ['install', '--no-audit']);
    endGroup();

    const buildScript = getInput('build-script');
    if (buildScript) {
        startGroup(`Building using "${buildScript}"`);
        await exec(buildScript);
        endGroup();
    }

    const firebaseToken = getInput('firebase-token', { required: true });

    const firebase = './node_modules/.bin/firebase';
    startGroup('Setting up Firebase');
    await exec('npm', [
        'install',
        '--no-save',
        '--no-package-lock',
        'https://storage.googleapis.com/firebase-preview-drop/node/firebase-tools/firebase-tools-7.13.0-hostingpreviews.1.tgz'
    ]);
    await exec(firebase, ['--open-sesame', 'hostingpreviews']);
    endGroup();
    
    startGroup(`Deploying to Firebase`);
    let buf = [];
    const deploymentExitCode = await exec(firebase, [
        'hosting:preview',
        '--token',
        firebaseToken,
        '--json'
    ], {
        listeners: {
            stdout(data) {
                buf.push(data);
            }
        }
    });
    const deploymentText = Buffer.concat(buf).toString('utf-8');
    const deployment = JSON.parse(deploymentText);
    //console.log('Deployment response:');
    //console.log(JSON.stringify(deployment, null, 2));
    endGroup();

    if (deployment.status !== 'success') {
        throw Error(deploymentText);
    }

    let url = deployment.result.previews.default.url;

    if (getInput('use-web-tld')) {
        url = url.replace(/\.firebaseapp\.com$/, '.web.app');
    }

    setOutput('details_url', url);
    setOutput('target_url', url);
    setOutput('url', url);

    // const dep = await github.repos.createDeploymentStatus({
    //     ...context.repo,
    //     deployment_id: context.payload.deployment.id,
    //     state: 'success',
    //     log_url: url,
    //     target_url: url,
    //     description: 'Deployment succeeded.'
    // });
    // console.log('deployment created: ', dep);

    return { url };

    /*
    {
        "status": "success",
        "result": {
            "previews": {
                "default": {
                    "target": null,
                    "site": "tooling-report",
                    "url": "https://tooling-report--18d5620fef5fe2d9.firebaseapp.com",
                    "name": "sites/tooling-report/versions/18d5620fef5fe2d9"
                }
            }
        }
    }
    */
}

(async () => {
    const token = process.env.GITHUB_TOKEN || getInput('repo-token');
    const github = token ? new GitHub(token) : {};

    let finish = details => console.log(details);
    if (token) {
        finish = await createCheck(github, context);
    }

    try {
        const result = await run(github, context) || {};

        if (!result.url) {
            throw Error('No URL was returned for the deployment.');
        }
        
        if (token) {
            await postOrUpdateComment(github, context, `
                🚀 Deploy preview for ${context.payload.pull_request.head.sha.substring(0,7)} succeeded:

                <a href="${result.url}">${result.url}</a>
            `.trim().replace(/^\s+/gm, ''));
        }

        await finish({
            details_url: result.url,
            conclusion: 'success',
            output: {
                title: `Deploy preview succeeded`,
                summary: `[${result.url}](${result.url})`
            }
        });
	} catch (e) {
		setFailed(e.message);

        await finish({
            conclusion: 'failure',
            output: {
                title: 'Deploy preview failed',
                summary: `Error: ${e.message}`
            }
        });
    }
})();


// create a check and return a function that updates (completes) it
async function createCheck(github, context) {
    const check = await github.checks.create({
        ...context.repo,
        name: 'Deploy Preview',
        head_sha: context.payload.pull_request.head.sha,
        status: 'in_progress',
    });

    return async details => {
        await github.checks.update({
            ...context.repo,
            check_run_id: check.data.id,
            completed_at: new Date().toISOString(),
            status: 'completed',
            ...details
        });
    };
}


// create a PR comment, or update one if it already exists
async function postOrUpdateComment(github, context, commentMarkdown) {
    const commentInfo = {
		...context.repo,
		issue_number: context.issue.number
	};

	const comment = {
		...commentInfo,
		body: commentMarkdown + '\n\n<sub>firebase-preview-action</sub>'
	};

	startGroup(`Updating PR comment`);
	let commentId;
	try {
		const comments = (await github.issues.listComments(commentInfo)).data;
		for (let i=comments.length; i--; ) {
			const c = comments[i];
			if (c.user.type === 'Bot' && /<sub>[\s\n]*firebase-preview-action/.test(c.body)) {
				commentId = c.id;
				break;
			}
		}
	}
	catch (e) {
		console.log('Error checking for previous comments: ' + e.message);
	}

	if (commentId) {
		try {
			await github.issues.updateComment({
				...context.repo,
				comment_id: commentId,
				body: comment.body
			});
		}
		catch (e) {
			commentId = null;
		}
	}

	// no previous or edit failed
	if (!commentId) {
		try {
			await github.issues.createComment(comment);
		} catch (e) {
			console.log(`Error creating comment: ${e.message}`);
        }
    }
    endGroup();
}