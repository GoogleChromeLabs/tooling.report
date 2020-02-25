import { exec } from '@actions/exec';
import { getInput, startGroup, endGroup, setFailed } from '@actions/core';
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

    startGroup('Setting up Firebase');
    await exec('npm', [
        'install',
        '--no-save',
        '--no-package-lock',
        'https://storage.googleapis.com/firebase-preview-drop/node/firebase-tools/firebase-tools-7.13.0-hostingpreviews.1.tgz'
    ]);
    await exec('firebase', ['--open-sesame', 'hostingpreviews']);
    endGroup();
    
    startGroup(`Deploying to Firebase`);
    const json = await exec('./node_modules/.bin/firebase', [
        'hosting:preview',
        '--token',
        firebaseToken,
        '--json'
    ]);
    endGroup();

    console.log(json);
}

(async () => {
	try {
		const token = getInput('repo-token');
		const github = token ? new GitHub(token) : {};
		await run(github, context);
	} catch (e) {
		setFailed(e.message);
	}
})();