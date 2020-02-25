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
    endGroup();

    console.log(JSON.stringify(deployment, null, 2));

    if (deployment.status !== 'success') {
        throw Error(deploymentText);
    }

    let url = deployment.result.previews.default.url;

    if (getInput('use-web-tld')) {
        url = url.replace(/\.firebaseapp\.com$/, '.web.app');
    }

    setOutput('details_url', url);

    // return { url };

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
    if (github.context) {
        const check = await github.checks.create({
            ...github.context.repo,
            name: 'Deploy Preview',
            head_sha: github.context.sha,
            status: 'in_progress',
        });
        finish = async details => {
            await github.checks.update({
                ...github.context.repo,
                check_run_id: check.data.id,
                completed_at: new Date().toISOString(),
                status: 'completed',
                ...details
            });
        };
    }
    try {
        const result = await run(github, context);

        await finish({
            details_url: result.url,
            conclusion: 'success',
            output: {
                title: `Deployed to ${result.url}`,
                text: `[View Preview](${result.url})`
            }
        });
	} catch (e) {
		setFailed(e.message);

        await finish({
            conclusion: 'failure',
            output: {
                title: 'Deploy preview failed',
                text: e.message
            }
        });
    }
})();