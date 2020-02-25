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
    // if (github.context) {
    //     const {owner, repo} = github.context.repo;
    //     const check = await github.checks.create({
    //         owner,
    //         repo,
    //         name: CHECK_NAME,
    //         head_sha: github.context.sha,
    //         status: 'in_progress',
    //     });
    //     // const checkId = check.data.id;
    // }
    try {
        await run(github, context);
	} catch (e) {
		setFailed(e.message);
	}
})();