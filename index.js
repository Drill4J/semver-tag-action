const core = require('@actions/core');
const github = require('@actions/core');
const semver = require('@drill4j/semver');

async function run() {
    try {
        const type = core.getInput('type');
        const token = core.getInput('github-token');
        const version = semver.parse('0.1.0');
        core.info(`Token ${type}`);
        core.setOutput('tag', version.toString());
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
