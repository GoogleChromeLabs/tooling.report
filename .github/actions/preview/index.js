import { exec } from '@actions/exec';
import { getInput, startGroup, endGroup, setFailed, setOutput } from '@actions/core';
import { GitHub, context } from '@actions/github';

async function run(github, context) {
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
    // let finish = details => console.log(details);
    if (token) {
        // console.log({ sha: context.sha, head_sha: context.payload.pull_request.head.sha });
        // console.log('GITHUB_TOKEN / repo-token available, creating status check.');
        // const check = await github.checks.create({
        //     ...context.repo,
        //     name: 'Deploy Preview',
        //     // head_sha: context.sha,
        //     head_sha: context.payload.pull_request.head.sha,
        //     status: 'in_progress',
        // });
        // console.log('status check: ', check);
        // finish = async details => {
        //     console.log('check update: ', await github.checks.update({
        //         ...context.repo,
        //         check_run_id: check.data.id,
        //         completed_at: new Date().toISOString(),
        //         status: 'completed',
        //         ...details
        //     }));
        // };
    }
    try {
        const result = await run(github, context) || {};

        if (!result.url) {
            throw Error('No URL was returned for the deployment.');
        }
        
        if (token) {
            await github.checks.create({
                ...context.repo,
                name: 'Deploy Preview',
                head_sha: context.payload.pull_request.head.sha,
                status: 'completed',
                completed_at: new Date().toISOString(),
                details_url: result.url,
                conclusion: 'success'
                // output: {
                //     title: `Deployed to ${result.url}`,
                //     summary: `[View Preview](${result.url})`
                // }
            });
        }

        // await finish({
        //     details_url: result.url,
        //     conclusion: 'success',
        //     output: {
        //         title: `Deployed to ${result.url}`,
        //         summary: `[View Preview](${result.url})`
        //     }
        // });
	} catch (e) {
		setFailed(e.message);

        // await finish({
        //     conclusion: 'failure',
        //     output: {
        //         title: 'Deploy preview failed',
        //         summary: `Error: ${e.message}`
        //     }
        // });
    }
})();