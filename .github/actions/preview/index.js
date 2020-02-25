import { exec } from '@actions/exec';
import { getInput, startGroup, endGroup, setFailed } from '@actions/core';
import { GitHub, context } from '@actions/github';

async function run(github, context) {
    startGroup(`Installing Firebase`);
    await exec(`npm i https://storage.googleapis.com/firebase-preview-drop/node/firebase-tools/firebase-tools-7.13.0-hostingpreviews.1.tgz`);
    endGroup();
    
    const buildScript = getInput('build-script');
    if (buildScript) {
        startGroup(`Building using "${buildScript}"`);
        await exec(buildScript);
        endGroup();
    }

    startGroup(`Deploying`);
    const json = await exec(`./node_modules/.bin/firebase hosting:preview --json`);
    endGroup();

    console.log(json);
}

(async () => {
	try {
		const token = getInput('repo-token');
		const octokit = new GitHub(token);
		await run(octokit, context);
	} catch (e) {
		setFailed(e.message);
	}
})();