const core = require('@actions/core');
const exec = require('@actions/exec');
const semver = require('@drill4j/semver');

const DEFAULT_PRERELEASE_VERSION = semver.parse("0.1.0-0");

async function run() {
    try {
        const type = core.getInput('type');
        core.info(`Tagging type - ${type}`);
        const token = core.getInput('repo-token');
        if (type === "prerelease") {
            const describe = await gitDescribe();
            const version = describe !== '' ? semver.prereleaseFromGit(describe) : DEFAULT_PRERELEASE_VERSION;
            setTagOutput(version)
        } else if (type === "patch") {
            const describe = await gitDescribe()
            if (describe !== '') {
                const version = semver.patchFromGit(describe);
                setTagOutput(version)
            } else {
                core.setFailed("No version tag found for patch tagging type.");
            }
        } else {
            core.setFailed(`Incorrect tagging type ${type}. Allowed values: "prerelease", "patch".`);
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

async function gitDescribe() {
    let myOutput = '';
    const options = {
        listeners: {
            stdout: (data) => {
                myOutput += data.toString();
            }
        },
        ignoreReturnCode: true
    };
    const args = [
        'describe',
        '--tags', '--long',
        '--match', 'v[0-9]*.[0-9]*.[0-9]*'
    ];
    await exec.exec('git', args, options);
    return myOutput.trim();
}

function setTagOutput(version) {
    const tag = `v${version.toString()}`
    core.info(`Tag - ${tag}`);
    core.setOutput('tag', tag);
}

run();
