const core = require('@actions/core');
const github = require('@actions/core');
const semver = require('@drill4j/semver');

async function run() {
    try {
        const type = core.getInput('type');
        const token = core.getInput('repo-token');
        if (type === "prerelease") {
            const version = semver.parse('0.1.0');
            core.setOutput('tag', version.toString());
        } else if (type === "patch") {
            const version = semver.parse('0.1.0');
            core.setOutput('tag', version.toString());
        } else {
            core.setFailed(`Incorrect tagging type ${type}. Allowed values: "prerelease", "patch"`);
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
